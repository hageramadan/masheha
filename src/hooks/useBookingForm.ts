// src/hooks/useBookingForm.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookingData, AdditionalService } from "@/src/types/booking";
import {
  calculateBookingTotal,
  validateBookingData,
  getInitialBookingData,
} from "@/src/utils/bookingUtils";
import { BookingService } from "@/src/services/bookingService";
import { CarService } from "@/src/services/carService";
import toast from "react-hot-toast";
import { CalculatePriceResponse } from "../types/api";
import { useAuth } from "@/src/context/AuthContext";
import {
  PaymentService,
  PaymentMethodType,
} from "@/src/services/paymentService";
import { UpdatePaymentStatusService } from "@/src/services/updatePaymentStatusService";

interface ExtendedTotals {
  subtotal: number;
  servicesTotal: number;
  tax: number;
  total: number;
  basePrice: number;
  discount: number;
  couponDiscount: number;
  totalDays: number;
}

// ✅ دالة مساعدة لفك ترميز Unicode escape sequences
const decodeUnicode = (str: string): string => {
  if (!str || typeof str !== 'string') return str;
  
  // إذا كان النص يحتوي على \u
  if (str.includes('\\u')) {
    try {
      return JSON.parse(`"${str}"`);
    } catch {
      try {
        return decodeURIComponent(str.replace(/\\u/g, '%u'));
      } catch {
        return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        });
      }
    }
  }
  
  return str;
};

// ✅ دالة استخراج الرسالة من أي نوع من الأخطاء
const extractErrorMessage = (error: any): string => {
  // 1️⃣ إذا كان الخطأ نصاً
  if (typeof error === 'string') {
    return decodeUnicode(error);
  }

  // 2️⃣ إذا كان الخطأ كائن له errors.start_time مباشرة
  if (error?.errors?.start_time && Array.isArray(error.errors.start_time)) {
    const timeError = error.errors.start_time[0];
    if (typeof timeError === 'string') {
      return decodeUnicode(timeError);
    }
    return String(timeError);
  }

  // 3️⃣ إذا كان الخطأ كائن له message
  if (error?.message) {
    // إذا كانت الرسالة كائن
    if (typeof error.message === 'object' && error.message !== null) {
      // محاولة استخراج الرسالة من الكائن
      if (error.message.errors?.start_time?.[0]) {
        return decodeUnicode(error.message.errors.start_time[0]);
      }
      if (error.message.message) {
        return decodeUnicode(error.message.message);
      }
      // محاولة تحويل الكائن إلى نص
      const jsonStr = JSON.stringify(error.message);
      // محاولة استخراج الرسالة من النص
      const match = jsonStr.match(/"message":"([^"]*)"/);
      if (match) {
        return decodeUnicode(match[1]);
      }
      return decodeUnicode(jsonStr);
    }
    
    if (typeof error.message === 'string') {
      // محاولة استخراج الرسالة من النص إذا كان يحتوي على JSON
      if (error.message.includes('{"message"')) {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed.message) {
            return decodeUnicode(parsed.message);
          }
          if (parsed.errors?.start_time?.[0]) {
            return decodeUnicode(parsed.errors.start_time[0]);
          }
        } catch {
          // إذا فشل الـ parse، نبحث بالـ regex
          const match = error.message.match(/"message":"([^"]*)"/);
          if (match) {
            return decodeUnicode(match[1]);
          }
        }
      }
      return decodeUnicode(error.message);
    }
    return String(error.message);
  }

  // 4️⃣ إذا كان الخطأ له response.data (من axios)
  if (error?.response?.data) {
    const data = error.response.data;
    
    if (data.errors?.start_time && Array.isArray(data.errors.start_time)) {
      const timeError = data.errors.start_time[0];
      if (typeof timeError === 'string') {
        return decodeUnicode(timeError);
      }
      return String(timeError);
    }

    if (data.message) {
      if (typeof data.message === 'string') {
        return decodeUnicode(data.message);
      }
      return String(data.message);
    }
  }

  // 5️⃣ إذا كان الخطأ له data مباشرة
  if (error?.data) {
    const data = error.data;
    
    if (data.errors?.start_time && Array.isArray(data.errors.start_time)) {
      const timeError = data.errors.start_time[0];
      if (typeof timeError === 'string') {
        return decodeUnicode(timeError);
      }
      return String(timeError);
    }

    if (data.message) {
      if (typeof data.message === 'string') {
        return decodeUnicode(data.message);
      }
      return String(data.message);
    }
  }

  // 6️⃣ محاولة استخراج الرسالة من أي كائن باستخدام regex
  if (error && typeof error === 'object') {
    const jsonStr = JSON.stringify(error);
    const match = jsonStr.match(/"message":"([^"]*)"/);
    if (match) {
      return decodeUnicode(match[1]);
    }
    const match2 = jsonStr.match(/"start_time":\["([^"]*)"\]/);
    if (match2) {
      return decodeUnicode(match2[1]);
    }
  }

  // 7️⃣ الحالة الافتراضية
  return error?.toString?.() || 'حدث خطأ غير متوقع';
};

// ✅ دالة parseErrorMessage المبسطة (للتوافق مع الكود القديم)
const parseErrorMessage = (error: any): string => {
  return extractErrorMessage(error);
};

const getEmptyBookingData = (carId: string): BookingData => ({
  ...getInitialBookingData(carId),
  customerName: "",
  customerPhone: "",
  selectedServices: [],
  rentalDate: "",
  rentalTime: "",
  rentalDays: 1,
  pickupAddress: "",
  pickupLocation: "",
  pickupLat: undefined,
  pickupLng: undefined,
  city: "",
  zip: "",
  selectedPaymentMethod: "",
  licenseFile: null,
  licenseFileName: "",
  subtotal: 0,
  tax: 0,
  total: 0,
  periodId: null,
});

export const useBookingForm = (
  carId: string,
  carPricePerDay: number,
  initialServices: AdditionalService[] = [],
  rentalCompanyId?: number,
  bookingType: "daily" | "monthly" = "daily",
  carName?: string,
) => {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  const [bookingData, setBookingData] = useState<BookingData>(
    () =>
      ({
        ...getInitialBookingData(carId),
        customerName: "",
        customerPhone: "",
        selectedServices: [],
      }) as BookingData,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [availableServices, setAvailableServices] =
    useState<AdditionalService[]>(initialServices);
  const [priceData, setPriceData] = useState<CalculatePriceResponse | null>(
    null,
  );
  const [isCalculating, setIsCalculating] = useState(false);

  // تخزين الـ period_id المختار (للحجز الشهري)
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);

  // Load Services
  useEffect(() => {
    if (initialServices.length === 0) {
      BookingService.getServices().then(setAvailableServices);
    }
  }, [initialServices]);

  // Ensure at least one service is selected
  useEffect(() => {
    if (
      availableServices.length > 0 &&
      bookingData.selectedServices.length === 0
    ) {
      setBookingData((prev) => ({
        ...prev,
        selectedServices: [availableServices[0].id],
      }));
    }
  }, [availableServices, bookingData.selectedServices]);

  // Calculate price from API
  const calculatePrice = useCallback(async () => {
    if (
      !bookingData.rentalDate ||
      !bookingData.rentalTime ||
      !bookingData.rentalDays
    ) {
      return;
    }

    if (!rentalCompanyId) {
      console.warn("No rental company ID provided");
      return;
    }

    setIsCalculating(true);
    try {
      const time = bookingData.rentalTime;

      const selectedServiceIds = bookingData.selectedServices
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

      const params: any = {
        booking_type: bookingType,
        rental_company_id: rentalCompanyId,
        start_date: bookingData.rentalDate,
        total_days: bookingData.rentalDays,
        car_id: parseInt(carId),
        start_time: time,
        additional_services:
          selectedServiceIds.length > 0 ? selectedServiceIds : undefined,
      };

      // إضافة period_id إذا كان موجوداً (للحجز الشهري)
      if (bookingType === "monthly" && selectedPeriodId) {
        params.period_id = selectedPeriodId;
      }

      console.log("📤 Calculate Price Params:", params);

      const response = await CarService.calculatePrice(params);
      setPriceData(response);

      return response;
    } catch (error) {
      console.error("Error calculating price:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [
    bookingData.rentalDate,
    bookingData.rentalTime,
    bookingData.rentalDays,
    rentalCompanyId,
    carId,
    bookingType,
    bookingData.selectedServices,
    selectedPeriodId,
  ]);

  // Recalculate when date, time, days, or services change
  useEffect(() => {
    if (
      bookingData.rentalDate &&
      bookingData.rentalTime &&
      bookingData.rentalDays > 0
    ) {
      const debounceTimer = setTimeout(() => {
        calculatePrice();
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [
    bookingData.rentalDate,
    bookingData.rentalTime,
    bookingData.rentalDays,
    bookingData.selectedServices,
    calculatePrice,
  ]);

  // Calculate services total from API response or local
  const servicesTotal = useMemo(() => {
    if (priceData) {
      const total = availableServices
        .filter((s) => bookingData.selectedServices.includes(s.id))
        .reduce((sum, s) => sum + (s.price || 0), 0);
      return total;
    }

    return availableServices
      .filter((s) => bookingData.selectedServices.includes(s.id))
      .reduce((sum, s) => sum + (s.price || 0), 0);
  }, [availableServices, bookingData.selectedServices, priceData]);

  // Calculate totals from API or fallback to local calculation
  const totals: ExtendedTotals = useMemo(() => {
    if (priceData) {
      return {
        basePrice: priceData.base_price,
        discount: priceData.discount_amount,
        couponDiscount: priceData.coupon_discount,
        subtotal: priceData.price_breakdown.subtotal,
        tax: priceData.price_breakdown.tax,
        total: priceData.total_amount,
        servicesTotal: servicesTotal,
        totalDays: priceData.total_days,
      };
    }

    const localTotals = calculateBookingTotal(
      carPricePerDay,
      bookingData.rentalDays || 0,
      availableServices,
      bookingData.selectedServices || [],
    );

    return {
      ...localTotals,
      basePrice: carPricePerDay * (bookingData.rentalDays || 0),
      discount: 0,
      couponDiscount: 0,
      totalDays: bookingData.rentalDays || 0,
    };
  }, [
    priceData,
    servicesTotal,
    carPricePerDay,
    bookingData.rentalDays,
    availableServices,
    bookingData.selectedServices,
  ]);

  // Update Field
  const updateField = useCallback(
    <K extends keyof BookingData>(field: K, value: BookingData[K]) => {
      setBookingData((prev) => ({ ...prev, [field]: value }));

      if (errors[field as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    },
    [errors],
  );

  // Toggle Service
  const toggleService = useCallback((serviceId: string) => {
    setBookingData((prev) => {
      const selected = prev.selectedServices || [];
      const newSelected = selected.includes(serviceId)
        ? selected.filter((id) => id !== serviceId)
        : [...selected, serviceId];

      return { ...prev, selectedServices: newSelected };
    });
  }, []);

  // File Upload
  const handleFileSelect = useCallback(
    (file: File | null) => {
      if (!file) {
        updateField("licenseFile", null);
        updateField("licenseFileName", "");
        return;
      }

      const validation = BookingService.validateLicenseFile(file);
      if (!validation.isValid) {
        toast.error(validation.error || "الملف غير صالح");
        return;
      }

      updateField("licenseFile", file);
      updateField("licenseFileName", file.name);
      toast.success("تم رفع الملف بنجاح");
    },
    [updateField],
  );

  const validate = useCallback(() => {
    const newErrors = validateBookingData(bookingData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [bookingData]);

  // دالة لتفريغ بيانات النموذج (بما في ذلك رقم الهاتف)
  const resetForm = useCallback(() => {
    setBookingData(getEmptyBookingData(carId));
    setPriceData(null);
    setErrors({});
    setIsSubmitting(false);
    setIsRedirecting(false);
    setIsCalculating(false);
    setSelectedPeriodId(null);
  }, [carId]);

  // دالة لتعيين period_id (للحجز الشهري)
  const setPeriodId = useCallback((periodId: number | null) => {
    setSelectedPeriodId(periodId);
  }, []);

  const submit = useCallback(async () => {
    if (!token) {
      toast.error("⚠️ يرجى تسجيل الدخول أولاً");
      router.push("/login");
      return null;
    }
    if (!validate()) {
      toast.error("⚠️ يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    if (!priceData) {
      toast.error("⚠️ يرجى الانتظار لحساب السعر");
      return;
    }

    setIsSubmitting(true);

    try {
      const uuid = crypto.randomUUID();

      const paymentMethodId = parseInt(bookingData.selectedPaymentMethod) || 0;
      const paymentMethods = await CarService.getPaymentMethods();
      const index = paymentMethods.findIndex(
        (method) => method.id === paymentMethodId,
      );
      const finalIndex = index !== -1 ? index : 1;

      let insuranceTypeId = 4;
      try {
        const carIdNumber = parseInt(carId);
        const officeId = rentalCompanyId || 0;
        const carDetails = await CarService.getDailyCarDetails(
          officeId,
          carIdNumber,
        );

        if (
          carDetails?.office?.insurance_types &&
          Array.isArray(carDetails.office.insurance_types) &&
          carDetails.office.insurance_types.length > 0
        ) {
          insuranceTypeId = carDetails.office.insurance_types[0].id;
        }
      } catch (error) {
        console.warn("⚠️ Could not fetch car details for insurance:", error);
      }

      const bookingDataWithExtra = {
        ...bookingData,
        carId: carId,
        totalAmount: totals.total,
        priceData: priceData,
        uuid: uuid,
        city: bookingData.city || "الرياض",
        zip: bookingData.zip || "12251",
        insuranceTypeId: insuranceTypeId,
        paymentMethodIndex: finalIndex,
        periodId: selectedPeriodId,
      };

      // 1. إنشاء الحجز
      const bookingResult = await BookingService.submitBooking(
        bookingDataWithExtra,
        {
          categoryId: 1,
          providerId: rentalCompanyId,
          office: {
            id: rentalCompanyId,
            insurance_types: [],
          },
          insuranceTypeId: insuranceTypeId,
        },
        bookingType,
        token,
      );

      if (!bookingResult.success) {
        const errorMessage = extractErrorMessage(bookingResult.error || bookingResult.message);
        toast.error(`❌ ${errorMessage}`);
        setIsSubmitting(false);
        return null;
      }

      // 3. معالجة الدفع
      setIsRedirecting(true);

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const callbackUrl = `${baseUrl}/payment-callback`;
      const successUrl = `${baseUrl}/booking-success`;
      const failUrl = `${baseUrl}/payment-failed`;

      const paymentResult = await PaymentService.processPayment(
        {
          car_name: carName || "سيارة",
          amount: totals.total,
          uuid: bookingResult.uuid || uuid,
          zip: bookingResult.zip || "12251",
          address: bookingData.pickupAddress || "",
          city: bookingData.city || "الرياض",
          payment_method: paymentMethodId as PaymentMethodType,
          return_url: successUrl,
          cancel_url: failUrl,
          callback_url: callbackUrl,
          booking_id: parseInt(bookingResult.bookingId || "0"),
        },
        token,
      );

      console.log("Payment Result:", paymentResult);

      if (paymentResult.success) {
        resetForm();

        if (paymentResult.isCash) {
          await UpdatePaymentStatusService.updatePaymentSuccess(
            bookingResult.uuid || uuid,
            paymentMethodId,
            { payment_type: "cash" },
            token,
          );

          toast.success("تم اختيار الدفع النقدي عند الاستلام", {
            duration: 3000,
            position: "top-center",
          });

          setIsRedirecting(false);
          setIsSubmitting(false);

          setTimeout(() => {
            router.push("/profile?tab=bookings");
          }, 1500);

          return { ...bookingResult, isCash: true };
        } else if (paymentResult.paymentUrl) {
          toast.success("🔄 جاري توجيهك إلى بوابة الدفع...", {
            duration: 3000,
            position: "top-center",
          });

          const paymentUrl = paymentResult.paymentUrl;

          if (!paymentUrl || !paymentUrl.startsWith("http")) {
            toast.error("❌ رابط الدفع غير صالح");
            setIsRedirecting(false);
            setIsSubmitting(false);
            return null;
          }

          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 1000);

          setIsRedirecting(false);
          setIsSubmitting(false);
          return { ...bookingResult, paymentUrl };
        } else {
          await UpdatePaymentStatusService.updatePaymentFailed(
            bookingResult.uuid || uuid,
            paymentMethodId,
            { error: "No payment URL received" },
            token,
          );
          toast.error("❌ لم يتم استلام رابط الدفع");
          setIsRedirecting(false);
          setIsSubmitting(false);
          return null;
        }
      } else {
        await UpdatePaymentStatusService.updatePaymentFailed(
          bookingResult.uuid || uuid,
          paymentMethodId,
          { error: paymentResult.message },
          token,
        );
        const errorMessage = extractErrorMessage(paymentResult.message);
        toast.error(`❌ ${errorMessage}`);
        setIsRedirecting(false);
        setIsSubmitting(false);
        return null;
      }
    } catch (error: any) {
      console.error("❌ Submit error:", error);
      const errorMessage = extractErrorMessage(error);
      toast.error(`❌ ${errorMessage}`);
      setIsRedirecting(false);
      setIsSubmitting(false);
      return null;
    }
  }, [
    bookingData,
    validate,
    priceData,
    totals.total,
    token,
    isAuthenticated,
    carId,
    rentalCompanyId,
    bookingType,
    carName,
    router,
    resetForm,
    selectedPeriodId,
  ]);

  return {
    bookingData,
    errors,
    isSubmitting,
    isRedirecting,
    totals,
    availableServices,
    isCalculating,
    priceData,
    updateField,
    toggleService,
    handleFileSelect,
    validate,
    submit,
    calculatePrice,
    resetForm,
    setPeriodId,
    selectedPeriodId,
  };
};