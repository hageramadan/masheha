// src/components/profile/ExtendBooking.tsx
"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { RiArrowRightSLine } from "react-icons/ri";
import toast from "react-hot-toast";

interface ExtendBookingProps {
  booking: {
    id: number;
    bookingNumber: string;
    carName: string;
    returnDate: string;
    rentalDays: number;
  };
  onBack: () => void;
  onExtend: (days: number) => void;
}

export default function ExtendBooking({
  booking,
  onBack,
  onExtend,
}: ExtendBookingProps) {
  const [days, setDays] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incrementDays = () => {
    setDays((prev) => prev + 1);
  };

  const decrementDays = () => {
    if (days > 1) {
      setDays((prev) => prev - 1);
    }
  };

  // دالة بسيطة لإضافة أيام إلى تاريخ
  const addDaysToDate = (dateStr: string, daysToAdd: number): string => {
    try {
      const date = new Date(dateStr);
      
      if (!isNaN(date.getTime())) {
        date.setDate(date.getDate() + daysToAdd);
        return date.toLocaleDateString("ar-EG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      
      return `${dateStr}`;
    } catch (error) {
      console.error("Error adding days:", error);
      return dateStr;
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      onExtend(days);
      setIsSubmitting(false);
      
      // إظهار توستر نجاح
      toast.success(`تم تمديد الحجز بنجاح لمدة ${days} يوم`, {
        duration: 3000,
        position: "top-center",
       
      });
      
      // العودة إلى تفاصيل الحجز بعد 1.5 ثانية
      setTimeout(() => {
        onBack();
      }, 1500);
    }, 1500);
  };

  // حساب التاريخ الجديد
  const newReturnDate = addDaysToDate(booking.returnDate, days);

  return (
    <div className="space-y-6 bg-white min-h-screen pb-20">
      {/* زر العودة */}
      <button
        onClick={onBack}
        className="flex items-center text-[#191C1F] hover:text-[#034f72] transition-colors"
      >
        <RiArrowRightSLine className="text-[30px]" />
        <span className="text-sm lg:text-lg font-bold">تمديد الحجز</span>
      </button>

      {/* بطاقة تمديد الحجز */}
      <div className="bg-white rounded-2xl shadow-xl p-3 lg:p-6 space-y-6">
        {/* عدد أيام الحجز */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            عدد أيام الحجز
          </label>
          <div className="flex items-center gap-2">
            <p className="text-gray-500 text-sm">{days} أيام</p>
            <div className="flex items-center border-2 rounded-xl overflow-hidden w-fit border-gray-200 focus-within:border-[#012738] transition-colors">
              <button
                type="button"
                onClick={decrementDays}
                disabled={days <= 1}
                className={cn(
                  "w-12 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                  days <= 1
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                )}
              >
                -
              </button>

              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1) {
                    setDays(value);
                  }
                }}
                onBlur={() => {
                  if (!days || days < 1) {
                    setDays(1);
                  }
                }}
                className="w-16 h-12 px-2 text-center text-gray-800 text-lg font-bold border-0 focus:outline-none focus:ring-0"
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
        </div>

        {/* معلومات التواريخ */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">تاريخ التسليم السابق</p>
            <p className="font-medium text-gray-800 text-sm">{booking.returnDate}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">تاريخ التسليم بعد التمديد</p>
            <p className="font-medium text-gray-800 text-sm">{newReturnDate}</p>
          </div>
        </div>

        {/* رسوم التمديد */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">رسوم التمديد ({days} يوم)</span>
            <span className="font-bold text-gray-800">{115 * days} ر.س</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">الضريبة</span>
            <span className="font-bold text-gray-800">
              {Math.round(115 * days * 0.15)} ر.س
            </span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
            <span>الإجمالي</span>
            <span className="text-primary">
              {Math.round(115 * days * 1.15)} ر.س
            </span>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
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
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}