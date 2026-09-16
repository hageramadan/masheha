// src/components/booking/BookingForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useBookingForm } from "@/src/hooks/useBookingForm";
import CarDetails from "./CarDetails";
import BookingServices from "./BookingServices";
import BookingPayment from "./BookingPayment";
import BookingSummary from "./BookingSummary";
import { FaLocationDot } from "react-icons/fa6";
import PhoneInput from "../contact/PhoneInput";
import { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import toast from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/select";
import { cn } from "@/src/lib/utils";
import DownloadSection2 from "../home/downloadSection2";
import GoogleMapPicker from "./GoogleMapPicker";
import { CarService } from "@/src/services/carService";
import { AvailableDate, AvailableHour } from "@/src/types/api";
import { useAuth } from "@/src/context/AuthContext";

import {
  AvailableMonth,
  AvailablePeriod,
} from "@/src/utils/bookingUtils";

// استيراد Hook Firebase
import { usePhoneAuth } from "@/src/hooks/usePhoneAuth";
// استيراد OTP Popup
import OTPPopup from "./OTPPopup";

// مكون السلايدر المخصص
import Image from "next/image";
import DateTimeSlider from "./DateTimeSlider";
import Download3 from "../home/download3";

interface BookingFormProps {
  carId: string;
  car: any;
  services: any[];
  periods?: any[];
  rentalType?: "يومي" | "شهري";
}

export default function BookingForm({
  carId,
  car,
  services,
  periods = [],
  rentalType = "يومي",
}: BookingFormProps) {
  const rentalCompanyId = car?.providerId || car?.office?.id;
  const bookingType = rentalType === "يومي" ? "daily" : "monthly";

  const { user, isAuthenticated, register } = useAuth();

  // ✅ استخرج الفترات الشهرية الفريدة من periods prop
  const monthlyPeriodsFromProps = useMemo(() => {
    if (!periods || periods.length === 0) return [];

    const unique = new Map<number, any>();
    periods.forEach((p: any) => {
      if (p?.id && !unique.has(p.id)) {
        unique.set(p.id, {
          id: p.id,
          days_count: p.days_count,
          final_price: p.final_price || p.price_total,
          label: p.label,
        });
      }
    });
    return Array.from(unique.values());
  }, [periods]);

  const {
    bookingData,
    errors,
    isSubmitting,
    isRedirecting,
    totals,
    availableServices,
    isCalculating,
    updateField,
    toggleService,
    submit,
    resetForm,
    setPeriodId,
    validateMonthlyPeriod,
    monthlyPeriods,
    availableMonthsData,
    setAvailableMonthsData,
  } = useBookingForm(
    carId,
    car?.pricePerDay || 0,
    services,
    rentalCompanyId,
    bookingType,
    car?.name || "سياره",
    monthlyPeriodsFromProps,
  );

  // Firebase Phone Auth
  const {
    sendOTP,
    verifyOTP,
    isOTPSent,
    isLoading: isOTPLoading,
  } = usePhoneAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [phoneInputKey, setPhoneInputKey] = useState(0);

  // ========== فترات الحجز اليومي ==========
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);

  // ========== فترات الحجز الشهري ==========
  const [availableMonths, setAvailableMonths] = useState<AvailableMonth[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<AvailableMonth | null>(
    null,
  );
  const [selectedPeriod, setSelectedPeriod] = useState<AvailablePeriod | null>(
    null,
  );

  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);

  // حالات OTP
  const [otpCode, setOtpCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);

  // حالة تسجيل المستخدم
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  // ✅ حالة جديدة لتتبع ما إذا تم التحقق من الهوية بالكامل
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);

  // ✅ حالة جديدة لعرض "جاري التحقق"
  const [isVerifying, setIsVerifying] = useState(false);

  // حالة البوب اب
  const [isOTPPopupOpen, setIsOTPPopupOpen] = useState(false);

  // قائمة التواريخ المتاحة للتحديد في السلايدر
  const [availableDateList, setAvailableDateList] = useState<Date[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);

  // قائمة الأوقات المتاحة للتحديد في سلايدر الوقت
  const [availableTimeList, setAvailableTimeList] = useState<string[]>([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(0);

  const minimumDays = car?.minimumDays || car?.minimum_days || 1;

  // ========== الحجز الشهري ==========
  const [monthlyDateList, setMonthlyDateList] = useState<Date[]>([]);
  const [monthlyTimeList, setMonthlyTimeList] = useState<string[]>([]);
  const [selectedMonthlyDateIndex, setSelectedMonthlyDateIndex] =
    useState<number>(0);
  const [selectedMonthlyTimeIndex, setSelectedMonthlyTimeIndex] =
    useState<number>(0);

  // ✅ حالة منفصلة لعدد الأشهر (للحجز الشهري فقط)
  const [rentalMonths, setRentalMonths] = useState<number>(1);

  // دالة التحقق من صحة النموذج بالكامل
  const validateForm = useCallback(() => {
    const name = bookingData.customerName?.trim();
    const phone = bookingData.customerPhone?.trim();
    const rentalDate = bookingData.rentalDate;
    const rentalTime = bookingData.rentalTime;
    const rentalDays = bookingData.rentalDays;
    const paymentMethod = bookingData.selectedPaymentMethod;

    if (!name) {
      toast.error("يرجى إدخال الاسم");
      return false;
    }

    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return false;
    }

    if (!rentalDate) {
      toast.error("يرجى اختيار تاريخ الاستلام");
      return false;
    }

    if (!rentalTime) {
      toast.error("يرجى اختيار وقت الاستلام");
      return false;
    }

    if (bookingType === "daily" && (!rentalDays || rentalDays < minimumDays)) {
      toast.error(`الحد الأدنى للحجز هو ${minimumDays} أيام`);
      return false;
    }

    if (bookingType === "monthly" && !selectedPeriod) {
      toast.error("يرجى اختيار فترة الحجز");
      return false;
    }

    if (!selectedAddress) {
      toast.error("يرجى تحديد موقع الاستلام على الخريطة");
      return false;
    }

    if (!paymentMethod) {
      toast.error("يرجى اختيار طريقة الدفع");
      return false;
    }

    return true;
  }, [bookingData, bookingType, minimumDays, selectedAddress, selectedPeriod]);

  // تفريغ رقم الهاتف عند تغيير bookingData.customerPhone
  useEffect(() => {
    if (bookingData.customerPhone) {
      setPhoneNumber(bookingData.customerPhone);
    } else {
      setPhoneNumber("");
      setPhoneInputKey((prev) => prev + 1);
    }
  }, [bookingData.customerPhone]);

  // ملء بيانات المستخدم إذا كان مسجل دخول
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.name) {
        updateField("customerName", user.name);
      }
      if (user.phone) {
        const phone = user.phone.toString();
        setPhoneNumber(phone);
        updateField("customerPhone", phone);
      }
      if (user.country_code) {
        setCountryCode(user.country_code);
      }
      setIsUserRegistered(true);
      setIsIdentityVerified(true);
    }
  }, [isAuthenticated, user, updateField]);

  // دالة لإعادة تعيين النموذج بالكامل
  const handleResetForm = useCallback(() => {
    resetForm();
    setPhoneNumber("");
    setCountryCode("+966");
    setSelectedAddress("");
    setPhoneInputKey((prev) => prev + 1);
    setOtpCode("");
    setIsPhoneVerified(false);
    setIsIdentityVerified(false);
    setIsVerifying(false);
    setShowOTPInput(false);
    setIsUserRegistered(false);
    setIsOTPPopupOpen(false);
    toast.success("🔄 تم إعادة تعيين النموذج");
  }, [resetForm]);

  // تحويل الوقت من 24 ساعة إلى 12 ساعة
  const formatTimeTo12Hour = (time: string): string => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "م" : "ص";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  // ========== جلب فترات الحجز (اليومي والشهري معاً) ==========
  useEffect(() => {
    const fetchAllPeriods = async () => {
      try {
        setIsLoadingPeriods(true);
        const carIdNumber = parseInt(carId);
        const officeId = car?.providerId || car?.office?.id;

        if (!officeId) {
          console.warn("No office ID found");
          setIsLoadingPeriods(false);
          return;
        }

        // 🔹 1️⃣ جلب فترات الحجز اليومي
        const dailyData = await CarService.getAvailablePeriods(
          carIdNumber,
          officeId,
          "daily",
        );

        console.log("📥 Daily Periods Data:", dailyData);
        console.log(
          "📅 available_dates count:",
          dailyData.available_dates?.length,
        );

        // تخزين بيانات اليومي
        setAvailableDates(dailyData.available_dates || []);

        const dailyDates = (dailyData.available_dates || [])
          .filter((d) => d.is_available)
          .map((d) => new Date(d.date));

        console.log("📅 dailyDates count (after filter):", dailyDates.length);

        setAvailableDateList(dailyDates);

        // 🔹 2️⃣ جلب فترات الحجز الشهري
        const monthlyData = await CarService.getAvailablePeriods(
          carIdNumber,
          officeId,
          "monthly",
        );

        console.log("📥 Monthly Periods Data:", monthlyData);

        // ✅ ابعت الأشهر للـ hook
        if (monthlyData?.available_months?.length) {
          setAvailableMonthsData(monthlyData.available_months);
        }

        // ========== معالجة الحجز الشهري ==========
        if (bookingType === "monthly") {
          setMonthlyDateList(dailyDates);

          if (
            monthlyData.available_months &&
            monthlyData.available_months.length > 0
          ) {
            const months = monthlyData.available_months.filter(
              (month: any) => month.is_available,
            );
            setAvailableMonths(months);

            // اختيار أول شهر وفترة متاحة
            if (months.length > 0 && months[0].available_periods.length > 0) {
              const firstPeriod = months[0].available_periods[0];
              setSelectedPeriod(firstPeriod);
              setPeriodId(firstPeriod.id);
              updateField("rentalDays", firstPeriod.days_count);

              const monthsCount = Math.max(
                1,
                Math.round(firstPeriod.days_count / 30),
              );
              setRentalMonths(monthsCount);
            }
          } else {
            console.warn("⚠️ No monthly data available");
            setPeriodId(0);
          }

          // اختيار أول تاريخ تلقائيًا
          if (dailyDates.length > 0) {
            const firstDate = dailyDates[0];
            const firstDateStr = format(firstDate, "yyyy-MM-dd");

            updateField("rentalDate", firstDateStr);

            const dailyDate = (dailyData.available_dates || []).find(
              (date) => date.date === firstDateStr,
            );

            if (dailyDate) {
              const times = dailyDate.available_hours
                .filter((hour) => hour.is_available)
                .map((hour) => hour.time);

              setMonthlyTimeList(times);

              if (times.length > 0) {
                updateField("rentalTime", times[0]);
                setSelectedMonthlyTimeIndex(0);
              }
            }
          }
        }

        // تعيين التاريخ الأول تلقائياً للحجز اليومي
        if (bookingType === "daily" && dailyDates.length > 0) {
          const firstDate = dailyDates[0];
          const dateStr = format(firstDate, "yyyy-MM-dd");
          updateField("rentalDate", dateStr);
          setSelectedDateIndex(0);

          const selectedDate = (dailyData.available_dates || []).find(
            (d) => d.date === dateStr,
          );
          if (selectedDate) {
            const times = selectedDate.available_hours
              .filter((h) => h.is_available)
              .map((h) => h.time);
            setAvailableTimeList(times);
            if (times.length > 0) {
              updateField("rentalTime", times[0]);
              setSelectedTimeIndex(0);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching periods:", error);
      } finally {
        setIsLoadingPeriods(false);
      }
    };

    fetchAllPeriods();
  }, [carId, car?.providerId, car?.office?.id, bookingType]);

  // ========== تحديث الأوقات عند تغيير التاريخ (للحجز اليومي) ==========
  useEffect(() => {
    if (bookingData.rentalDate && availableDates.length > 0) {
      const selectedDate = availableDates.find(
        (d) => d.date === bookingData.rentalDate,
      );
      if (selectedDate) {
        const times = selectedDate.available_hours
          .filter((h) => h.is_available)
          .map((h) => h.time);

        setAvailableTimeList(times);
        setSelectedTimeIndex(0);

        // ✅ حدّث الوقت فقط لو مش موجود في القائمة الحالية
        if (times.length > 0 && !times.includes(bookingData.rentalTime)) {
          updateField("rentalTime", times[0]);
        }
      }
    }
  }, [bookingData.rentalDate, availableDates]);

  useEffect(() => {
    if (bookingData.rentalDays < minimumDays) {
      updateField("rentalDays", minimumDays);
    }
  }, [minimumDays]);

  const handlePhoneChange = (phone: string, code: string) => {
    setPhoneNumber(phone);
    setCountryCode(code);
    updateField("customerPhone", phone);
    setIsIdentityVerified(false);
    setIsPhoneVerified(false);
    setIsUserRegistered(false);
    setIsVerifying(false);
  };

  // دالة تنسيق رقم الهاتف لصيغة Firebase
  const formatPhoneNumber = (phone: string, countryCode: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const phoneWithoutZero = cleanPhone.startsWith("0")
      ? cleanPhone.slice(1)
      : cleanPhone;
    return `${countryCode}${phoneWithoutZero}`;
  };

  // 1️⃣ تسجيل المستخدم في Backend
  const handleRegisterUser = async () => {
    try {
      const name = bookingData.customerName?.trim();
      const phone = bookingData.customerPhone?.trim();

      if (!name) {
        toast.error("يرجى إدخال الاسم");
        return false;
      }
      if (!phone) {
        toast.error("يرجى إدخال رقم الجوال");
        return false;
      }

      if (isAuthenticated) {
        setIsUserRegistered(true);
        return true;
      }

      const registerData = {
        name: name,
        phone: phone,
        country_code: countryCode || "+966",
      };

      const response = await register(registerData);

      if (!response?.result) {
        return false;
      }

      setIsUserRegistered(true);
      return true;
    } catch (error: any) {
      console.error("Register error:", error);
      return false;
    }
  };

  // 2️⃣ إرسال OTP
  const handleSendOTP = async (): Promise<{
    success: boolean;
    errorCode?: string;
  }> => {
    const phone = bookingData.customerPhone?.trim();
    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return { success: false, errorCode: "empty-phone" };
    }

    const formattedPhone = formatPhoneNumber(phone, countryCode);

    const result = (await sendOTP(formattedPhone)) as {
      success: boolean;
      errorCode?: string;
    };

    if (result.success) {
      setShowOTPInput(true);
      setIsOTPPopupOpen(true);
    }

    return result;
  };

  // 3️⃣ ✅ التحقق من OTP (من البوب اب) - وبعدها Register
  const handleVerifyOTPFromPopup = async (code: string): Promise<boolean> => {
    const firebaseUser = await verifyOTP(code);

    if (!firebaseUser) {
      return false;
    }

    try {
      if (!isUserRegistered && !isAuthenticated) {
        const registered = await handleRegisterUser();

        if (!registered) {
          toast.error(
            "تم التحقق من الجوال لكن فشل تسجيل الحساب. حاول مرة أخرى.",
          );
          setIsPhoneVerified(true);
          setIsVerifying(false);
          return false;
        }
      }

      setIsPhoneVerified(true);
      setIsIdentityVerified(true);
      setShowOTPInput(false);
      setIsOTPPopupOpen(false);
      setIsVerifying(false);
      toast.success("✓ تم التحقق من هويتك بنجاح");
      return true;
    } catch (error) {
      console.error("Register after OTP error:", error);
      toast.error("حدث خطأ أثناء تسجيل الحساب");
      setIsVerifying(false);
      return false;
    }
  };

  // دالة إعادة إرسال OTP
  const handleResendOTP = async () => {
    const phone = bookingData.customerPhone?.trim();
    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return;
    }

    const formattedPhone = formatPhoneNumber(phone, countryCode);
    const sent = await sendOTP(formattedPhone);
    if (sent) {
      toast.success("📱 تم إعادة إرسال رمز التحقق");
    }
  };

  // ✅ دالة التحقق من الهوية
  const handleVerifyIdentity = async () => {
    const name = bookingData.customerName?.trim();
    const phone = bookingData.customerPhone?.trim();

    if (!name) {
      toast.error("يرجى إدخال الاسم");
      return;
    }
    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return;
    }

    if (isIdentityVerified) {
      toast.success("✓ تم التحقق من هويتك بالفعل");
      return;
    }

    setIsVerifying(true);

    try {
      if (!isOTPSent) {
        const result = await handleSendOTP();

        if (!result.success) {
          const isCaptchaError =
            result.errorCode?.includes("-39") ||
            result.errorCode?.includes("captcha") ||
            result.errorCode?.includes("invalid-app-credential");

          if (isCaptchaError) {
            console.warn("⚠️ Captcha error - falling back to register only");

            const registered = await handleRegisterUser();

            if (registered) {
              setIsIdentityVerified(true);
              setIsVerifying(false);
              toast.success("✓ تم تسجيل حسابك بنجاح");
            } else {
              toast.error("فشل تسجيل الحساب. حاول مرة أخرى.");
              setIsVerifying(false);
            }
            return;
          }

          toast.error("فشل إرسال رمز التحقق");
          setIsVerifying(false);
          return;
        }
      } else {
        setIsOTPPopupOpen(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع");
      setIsVerifying(false);
    }
  };

  // معالج الضغط على زر الحجز
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isIdentityVerified && !isAuthenticated) {
      toast.error("يرجى التحقق من هويتك أولاً");
      return;
    }

    if (!validateForm()) return;

    await submit();
  };

  const handleLocationSelect = async (
    lat: number,
    lng: number,
    address: string,
  ) => {
    setSelectedAddress(address);
    updateField(
      "pickupLocation",
      address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    );
    updateField(
      "pickupAddress",
      address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    );
    updateField("pickupLat" as any, lat);
    updateField("pickupLng" as any, lng);
  };

  // دالة معالجة اختيار التاريخ من السلايدر (للحجز اليومي)
  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    updateField("rentalDate", dateStr);

    const selectedDate = availableDates.find((d) => d.date === dateStr);
    if (selectedDate) {
      const times = selectedDate.available_hours
        .filter((h) => h.is_available)
        .map((h) => h.time);
      setAvailableTimeList(times);
      if (times.length > 0) {
        updateField("rentalTime", times[0]);
        setSelectedTimeIndex(0);
      }
    }
  };

  // دالة معالجة اختيار التاريخ للحجز الشهري
  const handleMonthlyDateSelect = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const monthKey = dateStr.slice(0, 7);

    updateField("rentalDate", dateStr);

    const month = availableMonths.find(
      (m) => m.month === monthKey && m.is_available,
    );

    if (month) {
      setSelectedMonth(month);

      const period = month.available_periods[0];

      if (period) {
        setSelectedPeriod(period);
        setPeriodId(period.id);
        updateField("rentalDays", period.days_count);

        const monthsCount = Math.max(1, Math.round(period.days_count / 30));
        setRentalMonths(monthsCount);
      }
    }

    const selectedDate = availableDates.find((d) => d.date === dateStr);

    if (selectedDate) {
      const times = selectedDate.available_hours
        .filter((h) => h.is_available)
        .map((h) => h.time);

      setMonthlyTimeList(times);

      if (times.length > 0) {
        updateField("rentalTime", times[0]);
        setSelectedMonthlyTimeIndex(0);
      }
    }
  };

  // دالة معالجة اختيار الوقت من السلايدر
  const handleTimeSelect = (time: string) => {
    updateField("rentalTime", time);
  };

  // دوال التحكم في عدد الأيام (للحجز اليومي)
  const incrementDays = () => {
    const currentDays = bookingData.rentalDays || minimumDays;
    updateField("rentalDays", currentDays + 1);
  };

  const decrementDays = () => {
    const currentDays = bookingData.rentalDays || minimumDays;
    if (currentDays > minimumDays) {
      updateField("rentalDays", currentDays - 1);
    } else {
      toast.error(`الحد الأدنى للحجز هو ${minimumDays} أيام`);
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value >= minimumDays) {
        updateField("rentalDays", value);
      } else {
        toast.error(`الحد الأدنى للحجز هو ${minimumDays} أيام`);
        updateField("rentalDays", minimumDays);
      }
    }
  };

  // ✅ دوال التحكم في عدد الأشهر (للحجز الشهري)
  const incrementMonths = () => {
    const newMonths = (rentalMonths || 1) + 1;

    const validation = validateMonthlyPeriod(newMonths);

    if (!validation.isValid) {
      toast.error(validation.message, {
        duration: 5000,
        position: "top-center",
      });
      return;
    }

    setRentalMonths(newMonths);
    updateField("rentalDays", newMonths * 30);

    if (validation.periodId) {
      setPeriodId(validation.periodId);
    }
  };

  const decrementMonths = () => {
    const currentMonths = rentalMonths || 1;
    const newMonths = currentMonths - 1;

    const validation = validateMonthlyPeriod(newMonths);

    if (!validation.isValid) {
      toast.error(validation.message, {
        duration: 5000,
        position: "top-center",
      });
      return;
    }

    if (currentMonths > 1) {
      setRentalMonths(newMonths);
      updateField("rentalDays", newMonths * 30);

      if (validation.periodId) {
        setPeriodId(validation.periodId);
      }
    }
  };

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;

    const validation = validateMonthlyPeriod(value);

    if (!validation.isValid) {
      toast.error(validation.message, {
        duration: 5000,
        position: "top-center",
      });

      if (validation.periodId) {
        const period = monthlyPeriods.find(
          (p) => p.id === validation.periodId,
        );
        if (period) {
          const fallbackMonths = Math.max(
            1,
            Math.round(period.days_count / 30),
          );
          setRentalMonths(fallbackMonths);
          updateField("rentalDays", period.days_count);
          setPeriodId(period.id);
        }
      }
      return;
    }

    setRentalMonths(value);
    updateField("rentalDays", value * 30);

    if (validation.periodId) {
      setPeriodId(validation.periodId);
    }
  };

  // معالج اختيار الشهر للحجز الشهري
  const handleMonthSelect = (month: AvailableMonth) => {
    setSelectedMonth(month);
    if (month.available_periods.length > 0) {
      const period = month.available_periods[0];
      setSelectedPeriod(period);
      updateField("rentalDate", month.month);
      updateField("rentalDays", period.days_count);
      setPeriodId(period.id);

      const monthsCount = Math.max(1, Math.round(period.days_count / 30));
      setRentalMonths(monthsCount);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <CarDetails car={car} rentalType={rentalType} />
        </div>

        <div className="lg:col-span-1 ">
          <DownloadSection2 />
          <form onSubmit={handleSubmit} className="space-y-8 mb-4">
            <div className="bg-[#FCF9F466] border rounded-lg p-3 lg:p-5 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-bold text-[#1F2937] mb-2">
                    الاسم *
                  </label>

                  <input
                    type="text"
                    value={bookingData.customerName}
                    onChange={(e) =>
                      updateField("customerName", e.target.value)
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.customerName
                        ? "border-red-500"
                        : "border-gray-200 focus:border-primary"
                    }`}
                    placeholder="الاسم"
                  />

                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1F2937] mb-2">
                    رقم الجوال *
                  </label>

                  <PhoneInput
                    key={phoneInputKey}
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    required={true}
                  />

                  {errors.customerPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customerPhone}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifyIdentity}
                disabled={isOTPLoading || isVerifying || isIdentityVerified}
                className={cn(
                  "w-full py-3 rounded-xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-2",
                  isIdentityVerified
                    ? "bg-primary text-white cursor-default"
                    : "bg-primary hover:bg-primary-dark text-white hover:scale-[1.02] hover:shadow-lg",
                  (isOTPLoading || isVerifying) &&
                    "opacity-50 cursor-not-allowed",
                )}
              >
                {isOTPLoading || isVerifying ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    جاري التحقق ...
                  </>
                ) : isIdentityVerified ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    تم التحقق
                  </>
                ) : (
                  "تحقق"
                )}
              </button>
            </div>

            <div className="bg-[#FCF9F466] space-y-4 border rounded-lg p-3 lg:p-5">
              <div>
                <label className="block font-semibold text-sm text-[#1F2937] mb-2">
                  تاريخ ووقت التوصيل *
                </label>

                {bookingType === "daily" ? (
                  <DateTimeSlider
                    dates={availableDateList}
                    times={availableTimeList}
                    selectedDateIndex={selectedDateIndex}
                    selectedTimeIndex={selectedTimeIndex}
                    onDateSelect={(date, index) => {
                      setSelectedDateIndex(index);
                      handleDateSelect(date);
                    }}
                    onTimeSelect={(time, index) => {
                      setSelectedTimeIndex(index);
                      handleTimeSelect(time);
                    }}
                    formatTime={formatTimeTo12Hour}
                    isLoading={isLoadingPeriods}
                  />
                ) : (
                  <DateTimeSlider
                    dates={monthlyDateList}
                    times={monthlyTimeList}
                    selectedDateIndex={selectedMonthlyDateIndex}
                    selectedTimeIndex={selectedMonthlyTimeIndex}
                    onDateSelect={(date, index) => {
                      setSelectedMonthlyDateIndex(index);
                      handleMonthlyDateSelect(date);
                    }}
                    onTimeSelect={(time, index) => {
                      setSelectedMonthlyTimeIndex(index);
                      updateField("rentalTime", time);
                    }}
                    formatTime={formatTimeTo12Hour}
                    isLoading={isLoadingPeriods}
                  />
                )}

                {errors.rentalDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rentalDate}
                  </p>
                )}

                {errors.rentalTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.rentalTime}
                  </p>
                )}
              </div>

              {/* عدد الأيام للحجز اليومي */}
              {bookingType === "daily" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-[#1F2937] mb-2">
                      عدد أيام الحجز *
                    </label>
                    <p className="text-gray-500 text-sm">
                      {bookingData.rentalDays || minimumDays} أيام
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mx-auto">
                    <div className="flex items-center border-2 mx-auto rounded-xl overflow-hidden w-[90%] border-gray-200 focus-within:border-primary transition-colors">
                      <button
                        type="button"
                        onClick={incrementDays}
                        className="w-12 lg:w-16 h-12 bg-primary border-2 border-[var(--primary)] text-gray-100 hover:bg-gray-800 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        +
                      </button>

                      <input
                        type="number"
                        min={minimumDays}
                        value={bookingData.rentalDays || minimumDays}
                        onChange={handleDaysChange}
                        onBlur={() => {
                          if (
                            !bookingData.rentalDays ||
                            bookingData.rentalDays < minimumDays
                          ) {
                            updateField("rentalDays", minimumDays);
                            toast.error(
                              `الحد الأدنى للحجز هو ${minimumDays} أيام`,
                            );
                          }
                        }}
                        className={cn(
                          "w-full h-12 px-2 text-center text-gray-800 text-lg font-bold border-0 focus:outline-none focus:ring-0",
                          errors.rentalDays && "border-red-500",
                        )}
                      />

                      <button
                        type="button"
                        onClick={decrementDays}
                        className={cn(
                          "w-12 lg:w-16 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                          (bookingData.rentalDays || minimumDays) <= minimumDays
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1F2937]",
                        )}
                      >
                        -
                      </button>
                    </div>
                  </div>
                  {errors.rentalDays && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.rentalDays}
                    </p>
                  )}
                </div>
              )}

              {/* ✅ عدد الأشهر للحجز الشهري */}
              {bookingType === "monthly" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-[#1F2937] mb-2">
                      عدد أشهر الحجز *
                    </label>
                    <p className="text-gray-500 text-sm">
                      {rentalMonths} {rentalMonths === 1 ? "شهر" : "أشهر"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mx-auto">
                    <div className="flex items-center border-2 mx-auto rounded-xl overflow-hidden w-[90%] border-gray-200 focus-within:border-primary transition-colors">
                      <button
                        type="button"
                        onClick={incrementMonths}
                        className="w-12 lg:w-16 h-12 bg-primary border-2 border-[var(--primary)] text-gray-100 hover:bg-gray-800 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        +
                      </button>

                      <input
                        type="number"
                        min={1}
                        value={rentalMonths}
                        onChange={handleMonthsChange}
                        onBlur={() => {
                          if (!rentalMonths || rentalMonths < 1) {
                            setRentalMonths(1);
                            toast.error("الحد الأدنى للحجز هو شهر واحد");
                          }
                        }}
                        className={cn(
                          "w-full h-12 px-2 text-center text-gray-800 text-lg font-bold border-0 focus:outline-none focus:ring-0",
                          errors.rentalDays && "border-red-500",
                        )}
                      />

                      <button
                        type="button"
                        onClick={decrementMonths}
                        className={cn(
                          "w-12 lg:w-16 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                          (rentalMonths || 1) <= 1
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1F2937]",
                        )}
                      >
                        -
                      </button>
                    </div>
                  </div>
                  {errors.rentalDays && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.rentalDays}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-[#FCF9F466] border rounded-lg p-3 lg:p-5 space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-sm lg:text-base font-semibold text-gray-800">
                  موقع الاستلام *
                </h2>
                <Image
                  onClick={() => setIsMapOpen(true)}
                  src="/images/map.png"
                  alt="map"
                  className=" cursor-pointer w-full h-13.5 object-cover rounded-lg mb-2 lg:mb-3"
                  width={600}
                  height={300}
                />
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 justify-center text-sm lg:text-lg font-medium bg-primary text-white border border-primary/30 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <FaLocationDot className="text-lg" />
                  حدد الموقع على الخريطة
                </button>
              </div>

              {selectedAddress ? (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                  <FaLocationDot className="h-3 w-3 text-primary shrink-0" />
                  <span className="font-medium">الموقع المحدد:</span>
                  <span className="break-all">{selectedAddress}</span>
                </div>
              ) : (
                <p className="text-xs text-red-500 text-center">
                  ⚠️ يرجى تحديد موقع الاستلام على الخريطة
                </p>
              )}
            </div>
          </form>
          <BookingServices
            services={availableServices}
            selectedServices={bookingData.selectedServices}
            onToggle={toggleService}
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <BookingSummary
            car={car}
            rentalDays={bookingData.rentalDays}
            totals={totals}
            deliveryFee={20}
            isCalculating={isCalculating}
          />

          <BookingPayment
            selectedMethod={bookingData.selectedPaymentMethod}
            onSelect={(id) => updateField("selectedPaymentMethod", id)}
            error={errors.selectedPaymentMethod}
            rentalType={rentalType}
          />

          <div
            id="recaptcha-container"
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              overflow: "hidden",
              opacity: 0,
              pointerEvents: "none",
            }}
          />

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              isCalculating ||
              isRedirecting ||
              isOTPLoading ||
              isVerifying ||
              (!isIdentityVerified && !isAuthenticated)
            }
            className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                جاري الحجز...
              </span>
            ) : isRedirecting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                جاري التوجيه لبوابة الدفع...
              </span>
            ) : (
              `احجز الآن `
            )}
          </button>

          {!isIdentityVerified && !isAuthenticated && (
            <p className="text-xs text-center text-amber-600">
              ⚠️ يرجى التحقق من رقم الجوال لتفعيل زر الحجز
            </p>
          )}

          <Download3 />
        </div>

        <GoogleMapPicker
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onLocationSelect={handleLocationSelect}
          initialPosition={{ lat: 24.7136, lng: 46.6753 }}
        />
      </div>

      <OTPPopup
        isOpen={isOTPPopupOpen}
        onClose={() => {
          setIsOTPPopupOpen(false);
          setShowOTPInput(false);
          setIsVerifying(false);
        }}
        onVerify={handleVerifyOTPFromPopup}
        isLoading={isOTPLoading}
        phoneNumber={formatPhoneNumber(
          bookingData.customerPhone || "",
          countryCode,
        )}
        onResend={handleResendOTP}
      />
    </>
  );
}