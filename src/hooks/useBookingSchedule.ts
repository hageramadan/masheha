'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { CarService } from '@/src/services/carService';
import type { AvailableDate } from '@/src/types/api';
import type { AvailableMonth, AvailablePeriod } from '@/src/utils/bookingUtils';
import type { BookingFormController, BookingType } from '@/src/types/bookingForm';

type BookingScheduleProps = Pick<BookingFormController,
  'bookingData' | 'updateField' | 'setPeriodId' | 'validateMonthlyPeriod' | 'monthlyPeriods' | 'setAvailableMonthsData'
> & {
  carId: string;
  rentalCompanyId?: number;
  bookingType: BookingType;
  minimumDays: number;
};

export function useBookingSchedule({
  carId,
  rentalCompanyId,
  bookingType,
  minimumDays,
  bookingData,
  updateField,
  setPeriodId,
  validateMonthlyPeriod,
  monthlyPeriods,
  setAvailableMonthsData,
}: BookingScheduleProps) {
  // ========== فترات الحجز اليومي ==========
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);

  // ========== فترات الحجز الشهري ==========
  const [availableMonths, setAvailableMonths] = useState<AvailableMonth[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<AvailablePeriod | null>(
    null,
  );

  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);

  // قائمة التواريخ المتاحة للتحديد في السلايدر
  const [availableDateList, setAvailableDateList] = useState<Date[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);

  // قائمة الأوقات المتاحة للتحديد في سلايدر الوقت
  const [availableTimeList, setAvailableTimeList] = useState<string[]>([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(0);

  // ========== الحجز الشهري ==========
  const [monthlyDateList, setMonthlyDateList] = useState<Date[]>([]);
  const [monthlyTimeList, setMonthlyTimeList] = useState<string[]>([]);
  const [selectedMonthlyDateIndex, setSelectedMonthlyDateIndex] =
    useState<number>(0);
  const [selectedMonthlyTimeIndex, setSelectedMonthlyTimeIndex] =
    useState<number>(0);

  // ✅ حالة منفصلة لعدد الأشهر (للحجز الشهري فقط)
  const [rentalMonths, setRentalMonths] = useState<number>(1);

  // تحويل الوقت من 24 ساعة إلى 12 ساعة
  const formatTimeTo12Hour = (time: string): string => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "م" : "ص";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
  };
  // ✅ دالة فلترة الأوقات: تستبعد الأوقات السابقة لو التاريخ المختار هو النهاردة
  const filterAvailableTimes = useCallback(
    (times: string[], dateStr: string): string[] => {
      if (!dateStr || times.length === 0) return times;

      const today = new Date();
      const todayStr = format(today, "yyyy-MM-dd");

      if (dateStr !== todayStr) return times;

      const now = new Date();
      // ✅ بداية الساعة الجاية (لو 10:14 → 11:00)
      const nextHourStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 1,
        0,
        0,
        0,
      );

      return times.filter((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const timeDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours,
          minutes,
          0,
          0,
        );
        return timeDate >= nextHourStart;
      });
    },
    [],
  );
  // ========== جلب فترات الحجز (اليومي والشهري معاً) ==========
  useEffect(() => {
    const fetchAllPeriods = async () => {
      try {
        setIsLoadingPeriods(true);
        const carIdNumber = parseInt(carId);
        const officeId = rentalCompanyId;

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

        // تخزين بيانات اليومي
        setAvailableDates(dailyData.available_dates || []);

        const dailyDates = (dailyData.available_dates || [])
          .filter((d) => {
            if (!d.is_available) return false;
            // لازم يكون فيه وقت واحد على الأقل لسه متاح
            const validTimes = filterAvailableTimes(
              d.available_hours
                .filter((h: any) => h.is_available)
                .map((h: any) => h.time),
              d.date,
            );
            return validTimes.length > 0;
          })
          .map((d) => new Date(d.date));

        setAvailableDateList(dailyDates);

        // 🔹 2️⃣ جلب فترات الحجز الشهري
        const monthlyData = await CarService.getAvailablePeriods(
          carIdNumber,
          officeId,
          "monthly",
        );

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
              const times = filterAvailableTimes(
                dailyDate.available_hours
                  .filter((hour) => hour.is_available)
                  .map((hour) => hour.time),
                firstDateStr,
              );

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
            const times = filterAvailableTimes(
              selectedDate.available_hours
                .filter((h) => h.is_available)
                .map((h) => h.time),
              dateStr,
            );
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
  }, [carId, rentalCompanyId, bookingType]);

  // ========== تحديث الأوقات عند تغيير التاريخ (للحجز اليومي) ==========
  useEffect(() => {
    if (bookingData.rentalDate && availableDates.length > 0) {
      const selectedDate = availableDates.find(
        (d) => d.date === bookingData.rentalDate,
      );
      if (selectedDate) {
        const times = filterAvailableTimes(
          selectedDate.available_hours
            .filter((h) => h.is_available)
            .map((h) => h.time),
          bookingData.rentalDate,
        );

        setAvailableTimeList(times);
        setSelectedTimeIndex(0);

        // ✅ حدّث الوقت فقط لو مش موجود في القائمة الحالية
        if (times.length > 0 && !times.includes(bookingData.rentalTime)) {
          updateField("rentalTime", times[0]);
        }
      }
    }
  }, [bookingData.rentalDate, availableDates, filterAvailableTimes]);

  useEffect(() => {
    if (bookingData.rentalDays < minimumDays) {
      updateField("rentalDays", minimumDays);
    }
  }, [minimumDays]);

  // دالة معالجة اختيار التاريخ من السلايدر (للحجز اليومي)
  const handleDateSelect = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    updateField("rentalDate", dateStr);

    const selectedDate = availableDates.find((d) => d.date === dateStr);
    if (selectedDate) {
      const times = filterAvailableTimes(
        selectedDate.available_hours
          .filter((h) => h.is_available)
          .map((h) => h.time),
        dateStr,
      );
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
      const times = filterAvailableTimes(
        selectedDate.available_hours
          .filter((h) => h.is_available)
          .map((h) => h.time),
        dateStr,
      );

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
        const period = monthlyPeriods.find((p) => p.id === validation.periodId);
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

  return {
    selectedPeriod,
    availableDateList,
    availableTimeList,
    selectedDateIndex,
    selectedTimeIndex,
    setSelectedDateIndex,
    setSelectedTimeIndex,
    monthlyDateList,
    monthlyTimeList,
    selectedMonthlyDateIndex,
    selectedMonthlyTimeIndex,
    setSelectedMonthlyDateIndex,
    setSelectedMonthlyTimeIndex,
    rentalMonths,
    setRentalMonths,
    isLoadingPeriods,
    formatTimeTo12Hour,
    handleDateSelect,
    handleMonthlyDateSelect,
    handleTimeSelect,
    incrementDays,
    decrementDays,
    handleDaysChange,
    incrementMonths,
    decrementMonths,
    handleMonthsChange,
  };
}
