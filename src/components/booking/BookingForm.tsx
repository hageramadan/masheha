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
import { useState, useEffect, useCallback } from "react";
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

import AuthPopup from "@/src/components/common/AuthPopup";
import { useAuth } from "@/src/context/AuthContext";

import {
  AvailableMonth,
  AvailablePeriod,
  getAvailableMonths,
  getFirstAvailableMonth,
} from "@/src/utils/bookingUtils";

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

  const { user, isAuthenticated } = useAuth();

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
    handleFileSelect,
    submit,
    resetForm,
    setPeriodId,
  } = useBookingForm(
    carId,
    car?.pricePerDay || 0,
    services,
    rentalCompanyId,
    bookingType,
    car?.name || "سياره"
  );

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [phoneInputKey, setPhoneInputKey] = useState(0);

  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
 const [pendingBooking, setPendingBooking] = useState<(() => Promise<unknown>) | null>(null);

  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableHour[]>([]);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);

  // ✅ حالات الحجز الشهري
  const [availableMonths, setAvailableMonths] = useState<AvailableMonth[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<AvailableMonth | null>(
    null
  );
  const [selectedPeriod, setSelectedPeriod] = useState<AvailablePeriod | null>(
    null
  );

  const minimumDays = car?.minimumDays || car?.minimum_days || 1;

  // ✅ تفريغ رقم الهاتف عند تغيير bookingData.customerPhone
  useEffect(() => {
    if (bookingData.customerPhone) {
      setPhoneNumber(bookingData.customerPhone);
    } else {
      setPhoneNumber("");
      setPhoneInputKey((prev) => prev + 1);
    }
  }, [bookingData.customerPhone]);

  // ✅ دالة لإعادة تعيين النموذج بالكامل
  const handleResetForm = useCallback(() => {
    resetForm();
    setPhoneNumber("");
    setCountryCode("+966");
    setSelectedAddress("");
    setPhoneInputKey((prev) => prev + 1);
    toast.success("🔄 تم إعادة تعيين النموذج");
  }, [resetForm]);

  useEffect(() => {
    const fetchAvailablePeriods = async () => {
      try {
        setIsLoadingPeriods(true);
        const carIdNumber = parseInt(carId);
        const officeId = car?.providerId || car?.office?.id;

        if (!officeId) {
          console.warn("No office ID found");
          return;
        }

        const data = await CarService.getAvailablePeriods(
          carIdNumber,
          officeId,
          bookingType
        );

        console.log("📥 Available Periods Data:", data);

        // ✅ معالجة الحجز الشهري
        if (bookingType === "monthly") {
          // ✅ التحقق مما إذا كانت available_dates فارغة (null)
          if (!data.available_dates || data.available_dates.length === 0) {
            // ✅ استخدام available_months بدلاً من ذلك
            if (data.available_months && data.available_months.length > 0) {
              const months = getAvailableMonths(data);
              setAvailableMonths(months);

              // ✅ اختيار أول شهر متاح افتراضياً
              const firstMonth = getFirstAvailableMonth(data);
              if (firstMonth) {
                setSelectedMonth(firstMonth);
                if (firstMonth.available_periods.length > 0) {
                  const period = firstMonth.available_periods[0];
                  setSelectedPeriod(period);
                  // ✅ تحديث الـ rentalDate بشهر الشهر الأول
                  updateField("rentalDate", firstMonth.month);
                  updateField("rentalDays", period.days_count);
                  // ✅ تعيين period_id
                  setPeriodId(period.id);
                }
              }
            }
          } else {
            // ✅ إذا كانت available_dates موجودة، استخدمها كالمعتاد
            setAvailableDates(data.available_dates || []);
            if (bookingData.rentalDate) {
              const selectedDate = data.available_dates.find(
                (d) => d.date === bookingData.rentalDate
              );
              if (selectedDate) {
                setAvailableTimes(selectedDate.available_hours || []);
              }
            }
          }
        } else {
          // ✅ الحجز اليومي - استخدم available_dates
          setAvailableDates(data.available_dates || []);
          if (bookingData.rentalDate) {
            const selectedDate = data.available_dates.find(
              (d) => d.date === bookingData.rentalDate
            );
            if (selectedDate) {
              setAvailableTimes(selectedDate.available_hours || []);
            }
          }
        }
      } catch (error) {
        console.log("Error fetching available periods:", error);
      } finally {
        setIsLoadingPeriods(false);
      }
    };

    fetchAvailablePeriods();
  }, [carId, car?.providerId, car?.office?.id, bookingType]);

  useEffect(() => {
    if (bookingData.rentalDate && availableDates.length > 0) {
      const selectedDate = availableDates.find(
        (d) => d.date === bookingData.rentalDate
      );
      if (selectedDate) {
        setAvailableTimes(selectedDate.available_hours || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isAuthenticated) {
    setIsAuthPopupOpen(true);
    // ✅ إصلاح: تمرير الدالة submit مباشرة
    setPendingBooking(() => submit);
    return;
  }

  await submit();
};

  const handleAuthSuccess = async () => {
    setIsAuthPopupOpen(false);

    if (pendingBooking) {
      await pendingBooking();
      setPendingBooking(null);
    }
  };

  const handleLocationSelect = async (
    lat: number,
    lng: number,
    address: string
  ) => {
    setSelectedAddress(address);
    updateField(
      "pickupLocation",
      address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    );
    updateField(
      "pickupAddress",
      address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    );
    updateField("pickupLat" as any, lat);
    updateField("pickupLng" as any, lng);
  };

  const generateTimeOptions = () => {
    if (availableTimes.length > 0) {
      return availableTimes
        .filter((hour) => hour.is_available)
        .map((hour) => hour.time);
    }

    const times = [];
    for (let i = 9; i <= 23; i++) {
      const hour = String(i).padStart(2, "0");
      times.push(`${hour}:00`);
      if (i < 23) {
        times.push(`${hour}:30`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

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

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy", { locale: ar });
  };

  // ✅ معالج اختيار الشهر للحجز الشهري
  const handleMonthSelect = (month: AvailableMonth) => {
    setSelectedMonth(month);
    if (month.available_periods.length > 0) {
      const period = month.available_periods[0];
      setSelectedPeriod(period);
      updateField("rentalDate", month.month);
      updateField("rentalDays", period.days_count);
      // ✅ تعيين period_id
      setPeriodId(period.id);
    }
  };

  // ✅ عرض الأشهر المتاحة في Select (للحجز الشهري)
  const renderMonthlySelector = () => {
    if (bookingType !== "monthly") return null;

    if (isLoadingPeriods) {
      return (
        <div className="text-center py-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">جاري تحميل الأشهر المتاحة...</p>
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
                : "border-gray-200 focus:border-primary"
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

        {selectedMonth && selectedPeriod && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  الفترة المحددة: {selectedPeriod.label}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedPeriod.days_count} يوم
                </p>
              </div>
              <p className="text-lg font-bold text-primary">
                {selectedPeriod.final_price} ر.س
              </p>
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

        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاسم *
                </label>
                <input
                  type="text"
                  value={bookingData.customerName}
                  onChange={(e) => updateField("customerName", e.target.value)}
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
                <label className="block text-sm font-bold text-gray-700 mb-2">
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

            <div className="bg-white space-y-4">
              {/* ✅ تاريخ الاستلام - معالجة الحجز اليومي والشهري */}
              {bookingType === "daily" ? (
                // ✅ الحجز اليومي - عرض التقويم
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    تاريخ الاستلام *
                  </label>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger className="w-full">
                      <div
                        style={{ width: "100%" }}
                        className={cn(
                          "flex justify-between text-right font-normal px-4 py-3 h-auto border-2 rounded-xl",
                          !bookingData.rentalDate && "text-muted-foreground",
                          errors.rentalDate
                            ? "border-red-500"
                            : "border-gray-200 hover:border-primary/50"
                        )}
                      >
                        <FaCalendarAlt className="ml-2 h-4 w-4 text-primary" />
                        {bookingData.rentalDate ? (
                          formatDate(new Date(bookingData.rentalDate))
                        ) : (
                          <span>اختر تاريخ الاستلام</span>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                      sideOffset={4}
                    >
                      {isLoadingPeriods ? (
                        <div className="p-4 text-center">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p className="text-sm text-gray-500 mt-2">
                            جاري التحميل...
                          </p>
                        </div>
                      ) : (
                        <Calendar
                          mode="single"
                          selected={
                            bookingData.rentalDate
                              ? new Date(bookingData.rentalDate)
                              : undefined
                          }
                          onSelect={(date: Date | undefined) => {
                            if (date) {
                              updateField(
                                "rentalDate",
                                format(date, "yyyy-MM-dd")
                              );
                              setIsCalendarOpen(false);
                            }
                          }}
                          disabled={(date) => isDateDisabled(date)}
                          className="rounded-xl"
                          locale={ar}
                        />
                      )}
                    </PopoverContent>
                  </Popover>
                  {errors.rentalDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rentalDate}
                    </p>
                  )}
                </div>
              ) : (
                // ✅ الحجز الشهري - عرض Select
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    اختر الشهر *
                  </label>
                  {renderMonthlySelector()}
                  {errors.rentalDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rentalDate}
                    </p>
                  )}
                </div>
              )}

              {/* ✅ وقت الاستلام - يظهر فقط للحجز اليومي */}
              {bookingType === "daily" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    وقت الاستلام *
                  </label>
                  <Select
                    value={bookingData.rentalTime || ""}
                    onValueChange={(value) =>
                      updateField("rentalTime", value || "")
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full px-4 py-6 h-auto border-2 rounded-xl focus:ring-0 focus:ring-offset-0",
                        errors.rentalTime
                          ? "border-red-500"
                          : "border-gray-200 focus:border-primary"
                      )}
                    >
                      <SelectValue placeholder="اختر وقت الاستلام" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {timeOptions.length > 0 ? (
                        timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          لا توجد أوقات متاحة لهذا اليوم
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.rentalTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rentalTime}
                    </p>
                  )}
                </div>
              )}

              {/* ✅ عدد أيام الحجز - يظهر فقط للحجز اليومي */}
              {bookingType === "daily" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    عدد أيام الحجز *
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-500 text-sm">
                      {bookingData.rentalDays || minimumDays} أيام
                    </p>
                    <div className="flex items-center border-2 rounded-xl overflow-hidden w-fit border-gray-200 focus-within:border-primary transition-colors">
                      <button
                        type="button"
                        onClick={decrementDays}
                        className={cn(
                          "w-12 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                          (bookingData.rentalDays || minimumDays) <=
                            minimumDays
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                        )}
                      >
                        -
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
                              `الحد الأدنى للحجز هو ${minimumDays} أيام`
                            );
                          }
                        }}
                        className={cn(
                          "w-16 h-12 px-2 text-center text-gray-800 text-lg font-bold border-0 focus:outline-none focus:ring-0",
                          errors.rentalDays && "border-red-500"
                        )}
                      />

                      <button
                        type="button"
                        onClick={incrementDays}
                        className="w-12 h-12 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        +
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

            <div className="bg-white space-y-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-sm lg:text-base font-bold text-gray-800">
                  موقع الاستلام
                </h2>
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 justify-center text-sm lg:text-lg font-medium bg-primary text-white border border-primary/30 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <FaLocationDot className="text-lg" />
                  حدد الموقع على الخريطة
                </button>
              </div>

              {selectedAddress && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                  <FaLocationDot className="h-3 w-3 text-primary shrink-0" />
                  <span className="font-medium">الموقع المحدد:</span>
                  <span className="break-all">{selectedAddress}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <BookingServices
            services={availableServices}
            selectedServices={bookingData.selectedServices}
            onToggle={toggleService}
          />

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

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || isCalculating || isRedirecting}
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
            ) : isCalculating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                جاري حساب السعر...
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

      <AuthPopup
        isOpen={isAuthPopupOpen}
        onClose={() => {
          setIsAuthPopupOpen(false);
          setPendingBooking(null);
        }}
        initialMode="login"
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}