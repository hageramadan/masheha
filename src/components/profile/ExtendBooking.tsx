/* eslint-disable @typescript-eslint/no-explicit-any */

// src/components/profile/ExtendBooking.tsx
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { RiArrowRightSLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { getAvailableExtensionDays } from "@/src/services/bookingApiService";

interface ExtendBookingProps {
  bookingId: number;
  bookingNumber: string;
  carName: string;
  returnDate: string;
  rentalDays: number;
  dailyPrice: number;
  tax: string;
  maxExtensionDays: number;
  onBack: () => void;
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default function ExtendBooking({
  bookingId,

  returnDate,

  maxExtensionDays,
  onBack,
}: ExtendBookingProps) {
  const [days, setDays] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extensionData, setExtensionData] = useState<{
    requested_days: number;
    available_days: number;
    tax_amount: string;
    extension_price: number;
    daily_price: number;
    new_end_date: string;
    new_end_time: string;
    conflicts: Array<{
      booking_id: number;
      start_date: string;
      end_date: string;
    }>;
  } | null>(null);

  useEffect(() => {
    async function fetchExtensionData() {
      if (days < 1) return;

      setIsLoading(true);
      try {
        const data = await getAvailableExtensionDays(bookingId, days);
        setExtensionData(data);
      } catch (error: any) {
        console.error("Error fetching extension data:", error);
        toast.error(error.message || "حدث خطأ في جلب بيانات التمديد");
      } finally {
        setIsLoading(false);
      }
    }

    fetchExtensionData();
  }, [days, bookingId]);

  const incrementDays = () => {
    if (days < maxExtensionDays) {
      setDays((prev) => prev + 1);
    } else {
      toast.error(`الحد الأقصى للتمديد هو ${maxExtensionDays} يوم`);
    }
  };

  const decrementDays = () => {
    if (days > 1) {
      setDays((prev) => prev - 1);
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value >= 1 && value <= maxExtensionDays) {
        setDays(value);
      } else if (value > maxExtensionDays) {
        toast.error(`الحد الأقصى للتمديد هو ${maxExtensionDays} يوم`);
        setDays(maxExtensionDays);
      } else if (value < 1) {
        setDays(1);
      }
    }
  };

  const handleSubmit = async () => {
    if (days < 1) {
      toast.error("الرجاء إدخال عدد أيام صحيح");
      return;
    }

    setIsSubmitting(true);
    try {
      // const result = await extendBooking(bookingId, days);

      toast.success(`تم تمديد الحجز بنجاح لمدة ${days} يوم`, {
        duration: 3000,
        position: "top-center",
      });

      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error: any) {
      console.error("Error extending booking:", error);
      toast.error(error.message || "حدث خطأ أثناء تمديد الحجز");
    } finally {
      setIsSubmitting(false);
    }
  };

  const newReturnDate = extensionData?.new_end_date
    ? formatDate(extensionData.new_end_date)
    : returnDate;

  return (
    <div className="space-y-6 bg-white min-h-screen pb-20">
      <button
        onClick={onBack}
        className="flex items-center text-[#191C1F] hover:text-[#034f72] transition-colors"
      >
        <RiArrowRightSLine className="text-[30px]" />
        <span className="text-sm lg:text-lg font-bold">تمديد الحجز</span>
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-3 lg:p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            عدد أيام التمديد
          </label>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-sm">{days} أيام</p>
            <div className="flex items-center border-2 rounded-xl overflow-hidden w-fit border-gray-200 focus-within:border-[#012738] transition-colors">
              <button
                type="button"
                onClick={decrementDays}
                disabled={days <= 1 || isSubmitting}
                className={cn(
                  "w-12 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                  days <= 1 || isSubmitting
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700",
                )}
              >
                -
              </button>

              <input
                type="number"
                min="1"
                max={maxExtensionDays}
                value={days}
                onChange={handleDaysChange}
                disabled={isSubmitting}
                className="w-16 h-12 px-2 text-center text-gray-800 text-lg font-bold border-0 focus:outline-none focus:ring-0"
              />

              <button
                type="button"
                onClick={incrementDays}
                disabled={days >= maxExtensionDays || isSubmitting}
                className={cn(
                  "w-12 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                  days >= maxExtensionDays || isSubmitting
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700",
                )}
              >
                +
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            الحد الأقصى للتمديد: {maxExtensionDays} يوم
          </p>
        </div>

        {/* حالة التحميل */}
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#012738] border-r-transparent"></div>
          </div>
        )}

        {!isLoading && extensionData && (
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500">تاريخ التسليم الحالي</p>
              <p className="font-medium text-gray-800 text-sm text-left">
                {formatDate(returnDate)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500">تاريخ التسليم الجديد</p>
              <div className="font-medium text-[#012738] text-sm text-left">
                <p>{newReturnDate}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && extensionData && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">رسوم التمديد ({days} يوم)</span>
              <span className="font-bold text-gray-800">
                {extensionData.extension_price.toFixed(2)} ر.س
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">الضريبة</span>
              <span className="font-bold text-gray-800">
                {parseFloat(extensionData.tax_amount).toFixed(2)} ر.س
              </span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span>الإجمالي</span>
              <span className="text-[#012738]">
                {(
                  extensionData.extension_price +
                  parseFloat(extensionData.tax_amount)
                ).toFixed(2)}{" "}
                ر.س
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || !extensionData}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#012738] text-white rounded-xl hover:bg-[#012738]/90 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                جاري التمديد...
              </>
            ) : (
              <span className="font-medium">تأكيد التمديد</span>
            )}
          </button>
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
