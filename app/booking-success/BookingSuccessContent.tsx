// app/booking-success/BookingSuccessContent.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useExtendBooking } from "@/src/hooks/useExtendBooking";
import { useAuth } from "@/src/context/AuthContext";

export default function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtensionSuccess, setIsExtensionSuccess] = useState(false);
  const [extensionError, setExtensionError] = useState<string | null>(null);

  // قراءة المعلمات من URL
  const orderUuid = searchParams.get("order_uuid");
  const bookingId = searchParams.get("booking_id");
  const uuid = searchParams.get("uuid");
  const status = searchParams.get("status") || "success";
  const type = searchParams.get("type"); // "extension" أو null

  // استخدام Hook التمديد
  const { handlePaymentCallback } = useExtendBooking({
    bookingId: 0, // سيتم استبداله من localStorage
    carName: '',
    onSuccess: () => {
      setIsExtensionSuccess(true);
      toast.success("✅ تم تمديد الحجز بنجاح!", {
        duration: 5000,
        position: "top-center",
      });
      setTimeout(() => {
        router.push('/profile?tab=bookings');
      }, 3000);
    },
  });

  // معالجة تمديد الحجز
  useEffect(() => {
    const processExtension = async () => {
      // التحقق من أن هذا طلب تمديد
      if (type !== 'extension') return;
      
      // التحقق من وجود uuid
      if (!uuid) {
        setExtensionError("❌ لا يوجد رقم طلب");
        return;
      }

      // التحقق من وجود token
      if (!token) {
        setExtensionError("❌ يرجى تسجيل الدخول");
        return;
      }

      setIsProcessing(true);

      try {
        // استدعاء دالة معالجة العودة من الدفع
        const success = await handlePaymentCallback(
          uuid,
          status as 'success' | 'failed'
        );

        if (success) {
          setIsExtensionSuccess(true);
          toast.success("✅ تم تمديد الحجز بنجاح!", {
            duration: 5000,
            position: "top-center",
          });
        } else {
          setExtensionError("❌ فشل تمديد الحجز");
          toast.error("❌ فشل تمديد الحجز، يرجى المحاولة مرة أخرى", {
            duration: 5000,
            position: "top-center",
          });
        }
      } catch (error: any) {
        console.error("❌ Error processing extension:", error);
        setExtensionError(error.message || "❌ حدث خطأ أثناء معالجة التمديد");
        toast.error(error.message || "❌ حدث خطأ أثناء معالجة التمديد", {
          duration: 5000,
          position: "top-center",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processExtension();
  }, [type, uuid, status, token, handlePaymentCallback]);

  // معالجة الحجز الجديد (الكود الموجود)
  useEffect(() => {
    // فقط إذا كان حجز جديد (ليس تمديد)
    if (type !== 'extension' && orderUuid) {
      toast.success("🎉 تم الحجز بنجاح!", {
        duration: 5000,
        position: "top-center",
      });
    }
  }, [orderUuid, type]);

  // عرض حالة التحميل لتمديد الحجز
  if (type === 'extension' && isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            جاري معالجة التمديد
          </h2>
          <p className="text-gray-600">يرجى الانتظار...</p>
        </div>
      </div>
    );
  }

  // عرض نتيجة تمديد الحجز
  if (type === 'extension') {
    if (isExtensionSuccess) {
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
              ✅ تم تمديد الحجز بنجاح!
            </h1>

            <p className="text-gray-600 mb-6">
              تم تمديد حجزك بنجاح. يمكنك عرض تفاصيل الحجز من خلال صفحة الحجوزات.
            </p>

            {uuid && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-right">
                <p className="text-sm text-gray-500">رقم الطلب</p>
                <p className="text-lg font-bold text-primary font-mono break-all">
                  {uuid}
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

    if (extensionError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
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

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ❌ فشل تمديد الحجز
            </h1>

            <p className="text-red-600 mb-6">{extensionError}</p>

            <div className="flex flex-col gap-3">
              <Link
                href="/profile?tab=bookings"
                className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                العودة للحجوزات
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
  }

  // عرض الحجز الجديد (الكود الأصلي)
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