// app/booking-success/BookingSuccessContent.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const orderUuid = searchParams.get("order_uuid");
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    if (orderUuid) {
      toast.success("🎉 تم الحجز بنجاح!", {
        duration: 5000,
        position: "top-center",
      });
    }
  }, [orderUuid]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          تم الحجز بنجاح!
        </h1>

        <p className="text-gray-600 mb-6">
          شكراً لك على حجزك. سنقوم بتأكيد الحجز قريباً.
        </p>

        {orderUuid && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-right">
            <p className="text-sm text-gray-500">رقم الحجز</p>
            <p className="text-lg font-bold text-primary font-mono">
              {orderUuid}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/profile?tab=bookings"
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            عرض حجوزاتي
          </Link>

          <Link
            href="/"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}