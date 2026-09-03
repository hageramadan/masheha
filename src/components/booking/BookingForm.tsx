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
import { useState, useEffect, useCallback, useRef } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import toast from "react-hot-toast";

import { Calendar } from "@/src/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/select";
import { cn } from "@/src/lib/utils";
import { FaCalendarAlt } from "react-icons/fa";

import GoogleMapPicker from "./GoogleMapPicker";
import { CarService } from "@/src/services/carService";
import { AvailableDate, AvailableHour } from "@/src/types/api";
import { useAuth } from "@/src/context/AuthContext";

import {
  AvailableMonth,
  AvailablePeriod,
  getAvailableMonths,
  getFirstAvailableMonth,
} from "@/src/utils/bookingUtils";

// استيراد Hook Firebase
import { usePhoneAuth } from "@/src/hooks/usePhoneAuth";
// استيراد OTP Popup
import OTPPopup from "./OTPPopup";

// مكون السلايدر المخصص
import DateSlider from "./DateSlider";
import TimeSlider from "./TimeSlider";
import Image from "next/image";
import DateTimeSlider from "./DateTimeSlider";

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
  } = useBookingForm(
    carId,
    car?.pricePerDay || 0,
    services,
    rentalCompanyId,
    bookingType,
    car?.name || "سياره",
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [phoneInputKey, setPhoneInputKey] = useState(0);

  // ========== فترات الحجز اليومي ==========
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableHour[]>([]);
  
  // ========== فترات الحجز الشهري ==========
  const [availableMonths, setAvailableMonths] = useState<AvailableMonth[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<AvailableMonth | null>(
    null,
  );
  const [selectedPeriod, setSelectedPeriod] = useState<AvailablePeriod | null>(
    null,
  );
  const [monthlyAvailableDates, setMonthlyAvailableDates] = useState<AvailableDate[]>([]);
  const [monthlyAvailableTimes, setMonthlyAvailableTimes] = useState<AvailableHour[]>([]);

  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);

  // حالات OTP
  const [otpCode, setOtpCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);

  // حالة تسجيل المستخدم
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  // حالة البوب اب
  const [isOTPPopupOpen, setIsOTPPopupOpen] = useState(false);

  // قائمة التواريخ المتاحة للتحديد في السلايدر
  const [availableDateList, setAvailableDateList] = useState<Date[]>([]);
  // الفهرس المختار في سلايدر التاريخ
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  // قائمة الأوقات المتاحة للتحديد في السلايدر الوقت
  const [availableTimeList, setAvailableTimeList] = useState<string[]>([]);
  // الفهرس المختار في سلايدر الوقت
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

    // 1️⃣ التحقق من الاسم
    if (!name) {
      toast.error("يرجى إدخال الاسم");
      return false;
    }

    // 2️⃣ التحقق من رقم الجوال
    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return false;
    }

    // 3️⃣ التحقق من تاريخ الاستلام (للحجز اليومي)
    if (!rentalDate) {
      toast.error("يرجى اختيار تاريخ الاستلام");
      return false;
    }

    // 4️⃣ التحقق من وقت الاستلام (للحجز اليومي)
    if (!rentalTime) {
      toast.error("يرجى اختيار وقت الاستلام");
      return false;
    }

    // 5️⃣ التحقق من عدد الأيام (للحجز اليومي)
    if (bookingType === "daily" && (!rentalDays || rentalDays < minimumDays)) {
      toast.error(`الحد الأدنى للحجز هو ${minimumDays} أيام`);
      return false;
    }

    // 6️⃣ التحقق من الشهر (للحجز الشهري)
    if (bookingType === "monthly" && !selectedPeriod) {
      toast.error("يرجى اختيار فترة الحجز");
      return false;
    }

    // 7️⃣ التحقق من موقع الاستلام
    if (!selectedAddress) {
      toast.error("يرجى تحديد موقع الاستلام على الخريطة");
      return false;
    }

    // 8️⃣ التحقق من طريقة الدفع
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
      // إذا كان مسجل دخول، اعتبره مسجل بالفعل
      setIsUserRegistered(true);
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
    setShowOTPInput(false);
    setIsUserRegistered(false);
    setIsOTPPopupOpen(false);
    toast.success("🔄 تم إعادة تعيين النموذج");
  }, [resetForm]);

  // تحويل الوقت من 24 ساعة إلى 12 ساعة مع ص/م
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
          return;
        }

        // 🔹 1️⃣ جلب فترات الحجز اليومي (للتواريخ والأوقات) - هذا هو المصدر الرئيسي
        const dailyData = await CarService.getAvailablePeriods(
          carIdNumber,
          officeId,
          "daily",
        );

        console.log("📥 Daily Periods Data:", dailyData);

        // تخزين بيانات اليومي
        setAvailableDates(dailyData.available_dates || []);
        const dailyDates = dailyData.available_dates
          .filter((d) => d.is_available)
          .map((d) => new Date(d.date));
        setAvailableDateList(dailyDates);

        // 🔹 2️⃣ جلب فترات الحجز الشهري (للأشهر والفترات) - اختياري للحصول على period_id
        const monthlyData = await CarService.getAvailablePeriods(
          carIdNumber,
          officeId,
          "monthly",
        );

        console.log("📥 Monthly Periods Data:", monthlyData);

        // ========== معالجة الحجز الشهري ==========
        if (bookingType === "monthly") {
          // ✅ استخدام التواريخ من dailyData مباشرة (بدون تصفية)
          setMonthlyDateList(dailyDates);

          // محاولة الحصول على period_id إذا كان متاحًا من monthlyData
          if (monthlyData.available_months && monthlyData.available_months.length > 0) {
            const months = monthlyData.available_months.filter(
              (month: any) => month.is_available,
            );
            setAvailableMonths(months);

            // اختيار أول شهر وفترة متاحة افتراضيًا للحصول على period_id
            if (months.length > 0 && months[0].available_periods.length > 0) {
              const firstPeriod = months[0].available_periods[0];
              setSelectedPeriod(firstPeriod);
              setPeriodId(firstPeriod.id);
              updateField("rentalDays", firstPeriod.days_count);
              
              // ✅ حساب عدد الأشهر من days_count (شهر = 30 يوم)
              const monthsCount = Math.max(1, Math.round(firstPeriod.days_count / 30));
              setRentalMonths(monthsCount);
            }
          } else {
            console.warn("⚠️ No monthly data available, period_id will be null");
            setPeriodId(0);
          }

          // اختيار أول تاريخ تلقائيًا (من dailyDates)
          if (dailyDates.length > 0) {
            const firstDate = dailyDates[0];
            const firstDateStr = format(firstDate, "yyyy-MM-dd");

            // حفظ التاريخ
            updateField("rentalDate", firstDateStr);

            // البحث عن بيانات اليوم للحصول على الأوقات
            const dailyDate = dailyData.available_dates.find(
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
        if (bookingType === "daily" && dailyDates.length > 0 && !bookingData.rentalDate) {
          const firstDate = dailyDates[0];
          const dateStr = format(firstDate, "yyyy-MM-dd");
          updateField("rentalDate", dateStr);
          setSelectedDateIndex(0);

          // جلب أوقات هذا التاريخ
          const selectedDate = dailyData.available_dates.find(
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
        setAvailableTimes(selectedDate.available_hours || []);
        const times = selectedDate.available_hours
          .filter((h) => h.is_available)
          .map((h) => h.time);
        setAvailableTimeList(times);
        setSelectedTimeIndex(0);
        if (times.length > 0) {
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

  const isDateDisabled = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const availableDate = availableDates.find((d) => d.date === dateStr);
    return !availableDate?.is_available;
  };

  const handlePhoneChange = (phone: string, code: string) => {
    setPhoneNumber(phone);
    setCountryCode(code);
    updateField("customerPhone", phone);
  };

  // دالة تنسيق رقم الهاتف لصيغة Firebase
  const formatPhoneNumber = (phone: string, countryCode: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const phoneWithoutZero = cleanPhone.startsWith("0")
      ? cleanPhone.slice(1)
      : cleanPhone;
    return `${countryCode}${phoneWithoutZero}`;
  };

  // 1️⃣ أولاً: تسجيل المستخدم في Backend
  const handleRegisterUser = async () => {
    try {
      // التحقق من صحة النموذج قبل التسجيل
      if (!validateForm()) return false;

      const name = bookingData.customerName?.trim();
      const phone = bookingData.customerPhone?.trim();

      // لو مسجل دخول بالفعل، مش محتاج تسجيل
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

  // 2️⃣ إرسال OTP (تفتح البوب اب)
  const handleSendOTP = async () => {
    const phone = bookingData.customerPhone?.trim();
    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return false;
    }

    const formattedPhone = formatPhoneNumber(phone, countryCode);
    const sent = await sendOTP(formattedPhone);

    if (sent) {
      setShowOTPInput(true);
      setIsOTPPopupOpen(true);
      return true;
    }
    return false;
  };

  // 3️⃣ التحقق من OTP (من البوب اب)
  const handleVerifyOTPFromPopup = async (code: string): Promise<boolean> => {
    const user = await verifyOTP(code);
    if (user) {
      setIsPhoneVerified(true);
      setShowOTPInput(false);
      setIsOTPPopupOpen(false);
      await submit();
      return true;
    }
    return false;
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

  // معالج الضغط على زر الحجز
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من صحة النموذج بالكامل قبل أي شيء
    if (!validateForm()) return;

    // 🎯 الترتيب:

    // 1️⃣ تسجيل المستخدم في Backend (أولاً)
    if (!isUserRegistered) {
      const registered = await handleRegisterUser();
      if (!registered) return;
      // بعد التسجيل، نكمل لإرسال OTP
    }

    // 2️⃣ لو OTP متحقق منه → ننفذ الحجز
    if (isPhoneVerified) {
      await submit();
      return;
    }

    // 3️⃣ لو OTP مش مرسل → نرسله ونفتح البوب اب
    if (!isOTPSent) {
      await handleSendOTP();
      return;
    }

    // 4️⃣ لو OTP مرسل بس لسه متحققش → نفتح البوب اب
    if (isOTPSent && !isPhoneVerified) {
      setIsOTPPopupOpen(true);
      toast.error("📱 أدخل رمز التحقق");
    }
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

    // مهم: الشهر بصيغة 2026-11
    const monthKey = dateStr.slice(0, 7);

    // حفظ التاريخ الحقيقي
    updateField("rentalDate", dateStr);

    // البحث عن الشهر في Monthly API
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
        
        // ✅ حساب عدد الأشهر من days_count
        const monthsCount = Math.max(1, Math.round(period.days_count / 30));
        setRentalMonths(monthsCount);
      }
    }

    // جلب الأوقات من Daily API
    const selectedDate = availableDates.find(
      (d) => d.date === dateStr,
    );

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
    setRentalMonths(newMonths);
    // تحديث عدد الأيام بناءً على عدد الأشهر (شهر = 30 يوم)
    const newDays = newMonths * 30;
    updateField("rentalDays", newDays);
  };

  const decrementMonths = () => {
    const currentMonths = rentalMonths || 1;
    if (currentMonths > 1) {
      const newMonths = currentMonths - 1;
      setRentalMonths(newMonths);
      // تحديث عدد الأيام بناءً على عدد الأشهر (شهر = 30 يوم)
      const newDays = newMonths * 30;
      updateField("rentalDays", newDays);
    } else {
      toast.error("الحد الأدنى للحجز هو شهر واحد");
    }
  };

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setRentalMonths(value);
      // تحديث عدد الأيام بناءً على عدد الأشهر (شهر = 30 يوم)
      const newDays = value * 30;
      updateField("rentalDays", newDays);
    } else if (!isNaN(value) && value < 1) {
      toast.error("الحد الأدنى للحجز هو شهر واحد");
      setRentalMonths(1);
      updateField("rentalDays", 30);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy", { locale: ar });
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
      
      // ✅ حساب عدد الأشهر من days_count
      const monthsCount = Math.max(1, Math.round(period.days_count / 30));
      setRentalMonths(monthsCount);
    }
  };

  // عرض الأشهر المتاحة في Select (للحجز الشهري)
  const renderMonthlySelector = () => {
    if (bookingType !== "monthly") return null;

    if (isLoadingPeriods) {
      return (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      );
    }

    if (availableMonths.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          <p>لا توجد أشهر متاحة للحجز الشهري</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Select
          value={selectedMonth?.month || ""}
          onValueChange={(value) => {
            const month = availableMonths.find((m) => m.month === value);
            if (month) {
              handleMonthSelect(month);
            }
          }}
        >
          <SelectTrigger
            className={cn(
              "w-full px-4 py-6 h-auto border-2 rounded-xl focus:ring-0 focus:ring-offset-0",
              errors.rentalDate
                ? "border-red-500"
                : "border-gray-200 focus:border-primary",
            )}
          >
            <SelectValue placeholder="اختر الشهر" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {availableMonths.map((month) => (
              <SelectItem key={month.month} value={month.month}>
                <div className="flex items-center justify-between w-full">
                  <span>
                    {month.month_name} {month.year}
                  </span>
                  {month.available_periods.length > 0 && (
                    <span className="text-sm text-primary font-bold mr-2">
                      {month.available_periods[0].final_price} ر.س
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* عرض تفاصيل الفترة المختارة */}
        {selectedPeriod && (
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p className="font-medium text-gray-700">تفاصيل الفترة:</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-gray-600">
              <span>عدد الأيام: {selectedPeriod.days_count} يوم</span>
              <span>السعر: {selectedPeriod.final_price} ر.س</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <CarDetails car={car} rentalType={rentalType} />
        </div>

        <div className="lg:col-span-1 ">
          <form onSubmit={handleSubmit} className="space-y-8 mb-4">
            {!isAuthenticated && (
              <div className="bg-[#FCF9F466] grid grid-cols-1 lg:grid-cols-2 gap-2 border rounded-lg p-3 lg:p-5">
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
                    disabled={isAuthenticated}
                  />
                  {isAuthenticated && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ تم ملء البيانات تلقائياً من حسابك
                    </p>
                  )}
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
                  {isAuthenticated && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ تم ملء البيانات تلقائياً من حسابك
                    </p>
                  )}
                  {errors.customerPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customerPhone}
                    </p>
                  )}
                </div>
              </div>
            )}

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

          {/* حاوية reCAPTCHA */}
          <div id="recaptcha-container"></div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={
              isSubmitting || isCalculating || isRedirecting || isOTPLoading
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
              `احجز الآن (${rentalType})`
            )}
          </button>
        </div>

        <GoogleMapPicker
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onLocationSelect={handleLocationSelect}
          initialPosition={{ lat: 24.7136, lng: 46.6753 }}
        />
      </div>

      {/* OTP Popup */}
      <OTPPopup
        isOpen={isOTPPopupOpen}
        onClose={() => {
          setIsOTPPopupOpen(false);
          setShowOTPInput(false);
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