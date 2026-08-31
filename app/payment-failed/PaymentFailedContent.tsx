// app/payment-failed/PaymentFailedContent.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderUuid = searchParams.get("order_uuid");
  const errorMessage = searchParams.get("error_message");
  const isCancelled = searchParams.get("cancelled") === "true";

  useEffect(() => {
    if (isCancelled) {
      toast.error("⏹️ تم إلغاء عملية الدفع", {
        duration: 5000,
        position: "top-center",
      });
    } else {
      toast.error("❌ فشل الدفع، يرجى المحاولة مرة أخرى", {
        duration: 5000,
        position: "top-center",
      });
    }
  }, [isCancelled]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        {isCancelled ? (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-yellow-600 mb-2">⏹️ تم إلغاء الدفع</h1>
            <p className="text-gray-600 mb-6">
              تم إلغاء عملية الدفع. يمكنك المحاولة مرة أخرى في أي وقت.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-red-600 mb-2">❌ فشل الدفع</h1>
            <p className="text-gray-600 mb-6">
              لم نتمكن من معالجة عملية الدفع.
              {errorMessage && (
                <span className="block text-sm text-red-500 mt-2">
                  {errorMessage}
                </span>
              )}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              يرجى المحاولة مرة أخرى أو استخدام طريقة دفع أخرى.
            </p>
          </>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.history.back()}
            className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            {isCancelled ? "المحاولة مرة أخرى" : "المحاولة مرة أخرى"}
          </button>

          {orderUuid && (
            <Link
              href={`/booking/${orderUuid}`}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              تعديل الحجز
            </Link>
          )}

          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}