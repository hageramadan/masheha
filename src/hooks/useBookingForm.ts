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

// ✅ دالة لتفريغ بيانات الحجز
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

  // ✅ تخزين الـ period_id المختار (للحجز الشهري)
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

      // ✅ إضافة period_id إذا كان موجوداً (للحجز الشهري)
      if (bookingType === "monthly" && selectedPeriodId) {
        params.period_id = selectedPeriodId;
      }

      console.log("📤 Calculate Price Params:", params);

      const response = await CarService.calculatePrice(params);
      setPriceData(response);

      return response;
    } catch (error) {
      console.error("Error calculating price:", error);
      toast.error("حدث خطأ في حساب السعر");
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

  // ✅ دالة لتفريغ بيانات النموذج (بما في ذلك رقم الهاتف)
  const resetForm = useCallback(() => {
    setBookingData(getEmptyBookingData(carId));
    setPriceData(null);
    setErrors({});
    setIsSubmitting(false);
    setIsRedirecting(false);
    setIsCalculating(false);
    setSelectedPeriodId(null);
  }, [carId]);

  // ✅ دالة لتعيين period_id (للحجز الشهري)
  const setPeriodId = useCallback((periodId: number) => {
    setSelectedPeriodId(periodId);
  }, []);

  const submit = useCallback(async () => {
    if (!validate()) {
      toast.error("⚠️ يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    if (!priceData) {
      toast.error("⚠️ يرجى الانتظار لحساب السعر");
      return;
    }

    if (!isAuthenticated || !token) {
      toast.error("⚠️ يرجى تسجيل الدخول أولاً");
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
        // ✅ إضافة period_id إذا كان موجوداً (للحجز الشهري)
        periodId: selectedPeriodId,
      };

      // ✅ 1. إنشاء الحجز
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
        toast.error(bookingResult.message || "حدث خطأ أثناء الحجز");
        setIsSubmitting(false);
        return null;
      }

      // ✅ عرض توستر نجاح الحجز
      toast.success("🎉 تم إنشاء الحجز بنجاح!", {
        duration: 4000,
        position: "top-center",
      });

      // ✅ 2. تحديث حالة الدفع إلى pending
      const updatePending =
        await UpdatePaymentStatusService.updatePaymentPending(
          bookingResult.uuid || uuid,
          paymentMethodId,
          undefined,
          token,
        );

      if (!updatePending) {
        console.warn("⚠️ Could not update payment status to pending");
      }

      // ✅ 3. معالجة الدفع باستخدام PaymentService
      setIsRedirecting(true);

      // ✅ بناء رابط العودة بعد الدفع
      const returnUrl = `${window.location.origin}/profile?tab=bookings&booking_id=${bookingResult.bookingId}&payment_status=success&uuid=${bookingResult.uuid || uuid}&payment_method_id=${paymentMethodId}`;

      const paymentResult = await PaymentService.processPayment(
        {
          car_name: carName || "سيارة",
          amount: totals.total,
          uuid: bookingResult.uuid || uuid,
          zip: bookingResult.zip || "12251",
          address: bookingData.pickupAddress || "",
          city: bookingData.city || "الرياض",
          payment_method: paymentMethodId as PaymentMethodType,
          return_url: returnUrl,
          booking_id: parseInt(bookingResult.bookingId || "0"),
        },
        token,
      );

      console.log("✅ Payment Result:", paymentResult);

      if (paymentResult.success) {
        // ✅ تفريغ البيانات بعد نجاح الدفع
        resetForm();

        if (paymentResult.isCash) {
          // ✅ حالة الدفع النقدي
          await UpdatePaymentStatusService.updatePaymentSuccess(
            bookingResult.uuid || uuid,
            paymentMethodId,
            { payment_type: "cash" },
            token,
          );

          toast.success("✅ تم اختيار الدفع النقدي عند الاستلام", {
            duration: 3000,
            position: "top-center",
          });

          setIsRedirecting(false);
          setIsSubmitting(false);

          // ✅ استخدام router.push للتنقل الداخلي
          setTimeout(() => {
            router.push("/profile?tab=bookings");
          }, 1500);

          return { ...bookingResult, isCash: true };
        } else if (paymentResult.paymentUrl) {
          // ✅ فتح رابط الدفع في صفحة جديدة
          toast.success("🔄 جاري توجيهك إلى بوابة الدفع...", {
            duration: 3000,
            position: "top-center",
          });

          const paymentUrl = paymentResult.paymentUrl;

          // ✅ التحقق من صحة الرابط
          if (!paymentUrl || !paymentUrl.startsWith("http")) {
            toast.error("❌ رابط الدفع غير صالح");
            setIsRedirecting(false);
            setIsSubmitting(false);
            return null;
          }

          // ✅ للروابط الخارجية نستخدم window.location.href
          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 1000);

          setIsRedirecting(false);
          setIsSubmitting(false);
          return { ...bookingResult, paymentUrl };
        } else {
          // ❌ لم يتم استلام رابط
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
        // ❌ فشل الدفع
        await UpdatePaymentStatusService.updatePaymentFailed(
          bookingResult.uuid || uuid,
          paymentMethodId,
          { error: paymentResult.message },
          token,
        );
        toast.error(
          `❌ ${paymentResult.message || "حدث خطأ أثناء معالجة الدفع"}`,
        );
        setIsRedirecting(false);
        setIsSubmitting(false);
        return null;
      }
    } catch (error: any) {
      console.error("❌ Submit error:", error);
      toast.error(`❌ ${error.message || "حدث خطأ غير متوقع"}`);
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
