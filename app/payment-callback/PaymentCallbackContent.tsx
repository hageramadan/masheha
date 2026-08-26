// app/payment-callback/PaymentCallbackContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UpdatePaymentStatusService } from "@/src/services/updatePaymentStatusService";
import toast from "react-hot-toast";

export default function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState<"success" | "failed" | "pending">(
    "pending",
  );
  const [orderUuid, setOrderUuid] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // 1️⃣ استخراج المعاملات من URL
        const orderUuidParam = searchParams.get("order_uuid");
        const paymentStatus = searchParams.get("payment_status"); // success, failed, pending
        const paymentMethodId = searchParams.get("payment_method_id");
        const transactionId = searchParams.get("transaction_id");
        const referenceId = searchParams.get("reference_id");
        const responseCode = searchParams.get("response_code");
        const responseMessage = searchParams.get("response_message");
        const bookingId = searchParams.get("booking_id");

        setOrderUuid(orderUuidParam);

        // 2️⃣ التحقق من وجود البيانات الأساسية
        if (!orderUuidParam || !paymentMethodId) {
          toast.error("بيانات غير مكتملة");
          setStatus("failed");
          setIsProcessing(false);
          return;
        }

        // 3️⃣ الحصول على التوكن
        let token = localStorage.getItem("token");
        if (!token) {
          // محاولة الحصول من sessionStorage
          token = sessionStorage.getItem("token");
        }

        if (!token) {
          console.error("❌ No token found");
          toast.error("❌ يرجى تسجيل الدخول مرة أخرى");
          setStatus("failed");
          setIsProcessing(false);
          return;
        }

        // 4️⃣ بناء response كامل من البوابة
        const paymentResponse = {
          transaction_id: transactionId,
          reference_id: referenceId,
          response_code: responseCode,
          response_message: responseMessage,
          payment_status: paymentStatus,
          booking_id: bookingId,
          // أي بيانات إضافية من البوابة
          raw_response: Object.fromEntries(searchParams.entries()),
        };

        console.log("📤 Updating payment with response:", paymentResponse);

        // 5️⃣ تحديث حالة الدفع باستخدام الـ service
        const isUpdated = await UpdatePaymentStatusService.updatePaymentStatus(
          {
            order_uuid: orderUuidParam,
            payment_status: paymentStatus || "failed",
            payment_method_id: parseInt(paymentMethodId),
            response: paymentResponse,
          },
          token,
        );

        if (isUpdated) {
          setStatus("success");
          toast.success("✅ تم تحديث حالة الدفع بنجاح");

          // 6️⃣ توجيه المستخدم إلى صفحة النجاح
          setTimeout(() => {
            router.push(`/booking-success?order_uuid=${orderUuidParam}`);
          }, 2000);
        } else {
          setStatus("failed");
          toast.error("❌ فشل تحديث حالة الدفع");

          // 7️⃣ توجيه إلى صفحة الفشل
          setTimeout(() => {
            router.push(`/payment-failed?order_uuid=${orderUuidParam}`);
          }, 2000);
        }
      } catch (error) {
        console.error("Payment callback error:", error);
        setStatus("failed");
        toast.error("❌ حدث خطأ أثناء معالجة الدفع");
        setIsProcessing(false);
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, router]);

  // ✅ عرض حالة المعالجة
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        {isProcessing ? (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800">
              جاري معالجة الدفع...
            </h2>
            <p className="text-gray-600 mt-2">يرجى الانتظار لحظة</p>
            {orderUuid && (
              <p className="text-sm text-gray-500 mt-4">
                رقم الطلب: {orderUuid}
              </p>
            )}
          </>
        ) : status === "success" ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            <h2 className="text-2xl font-bold text-green-600">تم الدفع بنجاح!</h2>
            <p className="text-gray-600 mt-2">سيتم توجيهك إلى صفحة الحجز...</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            <h2 className="text-2xl font-bold text-red-600">فشل الدفع</h2>
            <p className="text-gray-600 mt-2">حدث خطأ أثناء معالجة الدفع</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90"
            >
              المحاولة مرة أخرى
            </button>
          </>
        )}
      </div>
    </div>
  );
}