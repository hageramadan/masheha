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
  const [status, setStatus] = useState<"success" | "failed" | "pending" | "cancelled">(
    "pending",
  );
  const [orderUuid, setOrderUuid] = useState<string | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<"paymob" | "mispay" | "tamara" | "unknown">("unknown");

  useEffect(() => {
    const processPayment = async () => {
      try {
        // ============================================
        // 1️⃣ استخراج جميع المعاملات من URL
        // ============================================
        const params = Object.fromEntries(searchParams.entries());
        console.log("📥 Payment Callback Params:", params);

        // ============================================
        // 2️⃣ تحديد مزود الدفع
        // ============================================
        const isMISPay = searchParams.has("code") && 
                         (searchParams.get("code")?.startsWith("MP") || false);
        
        const isPaymob = searchParams.has("success") || 
                         searchParams.has("txn_response_code") ||
                         searchParams.has("id");

        const isTamara = searchParams.has("paymentStatus") && 
                         searchParams.has("orderId") &&
                         (searchParams.get("paymentStatus") === "approved" || 
                          searchParams.get("paymentStatus") === "canceled" ||
                          searchParams.get("paymentStatus") === "declined");

        if (isMISPay) {
          setPaymentProvider("mispay");
          console.log("🏦 Payment Provider: MIS Pay");
          await handleMISPayCallback(params);
        } else if (isTamara) {
          setPaymentProvider("tamara");
          console.log("🏦 Payment Provider: Tamara");
          await handleTamaraCallback(params);
        } else if (isPaymob) {
          setPaymentProvider("paymob");
          console.log("🏦 Payment Provider: Paymob");
          await handlePaymobCallback(params);
        } else {
          // محاولة التعرف على المزود من المعاملات
          console.warn("⚠️ Unknown payment provider, trying to detect...");
          
          if (searchParams.has("order_uuid") && searchParams.has("payment_status")) {
            await handleGenericCallback(params);
          } else {
            toast.error("❌ مزود الدفع غير معروف");
            setStatus("failed");
            setIsProcessing(false);
          }
        }
        
      } catch (error: any) {
        console.error("❌ Payment callback error:", error);
        setStatus("failed");
        toast.error("❌ حدث خطأ أثناء معالجة الدفع");
        
        const orderUuidParam = searchParams.get("order_uuid");
        setTimeout(() => {
          router.push(`/payment-failed?order_uuid=${orderUuidParam || ''}&error_message=${encodeURIComponent(error.message || 'حدث خطأ غير متوقع')}`);
        }, 1500);
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, router]);

  // ============================================
  // 3️⃣ معالجة Callback من Tamara
  // ============================================
  const handleTamaraCallback = async (params: Record<string, string>) => {
    console.log("🔄 Processing Tamara Callback...");

    // معاملات Tamara
    const paymentStatus = searchParams.get("paymentStatus"); // approved, canceled, declined
    const orderId = searchParams.get("orderId");
    
    // المعاملات المخصصة لتطبيقك
    const orderUuidParam = searchParams.get("order_uuid");
    const paymentMethodId = searchParams.get("payment_method_id");
    const bookingId = searchParams.get("booking_id");

    setOrderUuid(orderUuidParam);

    // ============================================
    // 4️⃣ تحديد حالة الدفع من Tamara
    // ============================================
    let isPaymentSuccess = false;
    let paymentStatusText = "failed";
    let statusMessage = "";

    switch (paymentStatus) {
      case "approved":
        isPaymentSuccess = true;
        paymentStatusText = "paid";
        statusMessage = "✅ تم الدفع بنجاح عبر تمارا";
        break;
      case "canceled":
        isPaymentSuccess = false;
        paymentStatusText = "cancelled";
        statusMessage = "⏹️ تم إلغاء الدفع عبر تمارا";
        break;
      case "declined":
        isPaymentSuccess = false;
        paymentStatusText = "failed";
        statusMessage = "❌ تم رفض الدفع عبر تمارا";
        break;
      default:
        isPaymentSuccess = false;
        paymentStatusText = "failed";
        statusMessage = `❌ حالة غير معروفة: ${paymentStatus}`;
        console.warn(`⚠️ Unknown Tamara status: ${paymentStatus}`);
    }

    console.log(`💰 Tamara Status: ${paymentStatus} - ${statusMessage}`);
    console.log(`📊 Payment Status Text: ${paymentStatusText}`);

    // ============================================
    // 5️⃣ التحقق من وجود البيانات الأساسية
    // ============================================
    if (!orderUuidParam || !paymentMethodId) {
      console.error("❌ Missing order_uuid or payment_method_id");
      toast.error("بيانات غير مكتملة");
      setStatus("failed");
      setIsProcessing(false);
      return;
    }

    // ============================================
    // 6️⃣ الحصول على التوكن
    // ============================================
    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }

    if (!token) {
      console.error("❌ No token found");
      toast.error("❌ يرجى تسجيل الدخول مرة أخرى");
      setStatus("failed");
      setIsProcessing(false);
      return;
    }

    // ============================================
    // 7️⃣ بناء الـ Response كامل من Tamara
    // ============================================
    const paymentResponse = {
      // بيانات الدفع الأساسية
      provider: "tamara",
      payment_status: paymentStatus,
      order_id: orderId,
      message: statusMessage,
      
      // حالة الدفع
      success: isPaymentSuccess,
      status: paymentStatusText,
      
      // بيانات الحجز
      booking_id: bookingId,
      payment_method_id: paymentMethodId,
      
      // جميع المعاملات الخام
      raw: params,
    };

    console.log("📤 Updating Tamara payment with response:", paymentResponse);

    // ============================================
    // 8️⃣ تحديث حالة الدفع
    // ============================================
    const isUpdated = await UpdatePaymentStatusService.updatePaymentStatus(
      {
        order_uuid: orderUuidParam,
        payment_status: paymentStatusText, // paid / failed / cancelled
        payment_method_id: parseInt(paymentMethodId),
        response: paymentResponse,
      },
      token,
    );

    // ============================================
    // 9️⃣ معالجة النتيجة حسب الحالة
    // ============================================
    if (isUpdated && isPaymentSuccess) {
      setStatus("success");
      toast.success("✅ تم الدفع بنجاح عبر تمارا");

      localStorage.removeItem('currentBookingUUID');
      localStorage.removeItem('currentPaymentMethodId');

      setTimeout(() => {
        router.push(`/booking-success?order_uuid=${orderUuidParam}&booking_id=${bookingId}`);
      }, 1500);
      
    } else if (paymentStatus === "canceled") {
      // حالة الإلغاء
      setStatus("cancelled");
      toast.error("⏹️ تم إلغاء عملية الدفع عبر تمارا");
      
      setTimeout(() => {
        router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=تم إلغاء الدفع من قبل المستخدم&cancelled=true`);
      }, 1500);
      
    } else if (isUpdated && !isPaymentSuccess) {
      setStatus("failed");
      toast.error("❌ فشل الدفع عبر تمارا");
      
      setTimeout(() => {
        router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=تم رفض الدفع من تمارا (${paymentStatus})`);
      }, 1500);
      
    } else {
      setStatus("failed");
      toast.error("❌ فشل تحديث حالة الدفع");

      setTimeout(() => {
        router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=فشل تحديث حالة الدفع`);
      }, 1500);
    }
  };

  // ============================================
  // 🔟 معالجة Callback من MIS Pay
  // ============================================
  const handleMISPayCallback = async (params: Record<string, string>) => {
    console.log("🔄 Processing MIS Pay Callback...");

    const code = searchParams.get("code");
    const transactionId = searchParams.get("transaction_id");
    const referenceId = searchParams.get("reference_id");
    const message = searchParams.get("message");
    const orderId = searchParams.get("order_id");
    
    const orderUuidParam = searchParams.get("order_uuid");
    const paymentMethodId = searchParams.get("payment_method_id");
    const bookingId = searchParams.get("booking_id");

    setOrderUuid(orderUuidParam);

    let isPaymentSuccess = false;
    let paymentStatusText = "failed";
    let statusMessage = "";

    switch (code) {
      case "MP00":
        isPaymentSuccess = true;
        paymentStatusText = "paid";
        statusMessage = "✅ تم الدفع بنجاح";
        break;
      case "MP01":
        isPaymentSuccess = false;
        paymentStatusText = "failed";
        statusMessage = "❌ فشل الدفع";
        break;
      case "MP02":
        isPaymentSuccess = false;
        paymentStatusText = "cancelled";
        statusMessage = "⏹️ تم إلغاء الدفع";
        break;
      default:
        isPaymentSuccess = false;
        paymentStatusText = "failed";
        statusMessage = `❌ كود غير معروف: ${code}`;
        console.warn(`⚠️ Unknown MIS Pay code: ${code}`);
    }

    console.log(`💰 MIS Pay Status: ${code} - ${statusMessage}`);

    if (!orderUuidParam || !paymentMethodId) {
      console.error("❌ Missing order_uuid or payment_method_id");
      toast.error("بيانات غير مكتملة");
      setStatus("failed");
      setIsProcessing(false);
      return;
    }

    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }

    if (!token) {
      console.error("❌ No token found");
      toast.error("❌ يرجى تسجيل الدخول مرة أخرى");
      setStatus("failed");
      setIsProcessing(false);
      return;
    }

    const paymentResponse = {
      provider: "mispay",
      code: code,
      transaction_id: transactionId,
      reference_id: referenceId,
      order_id: orderId,
      message: message || statusMessage,
      success: isPaymentSuccess,
      status: paymentStatusText,
      booking_id: bookingId,
      payment_method_id: paymentMethodId,
      raw: params,
    };

    console.log("📤 Updating MIS Pay payment with response:", paymentResponse);

    const isUpdated = await UpdatePaymentStatusService.updatePaymentStatus(
      {
        order_uuid: orderUuidParam,
        payment_status: paymentStatusText,
        payment_method_id: parseInt(paymentMethodId),
        response: paymentResponse,
      },
      token,
    );

    if (isUpdated && isPaymentSuccess) {
      setStatus("success");
      toast.success("✅ تم الدفع بنجاح");
      localStorage.removeItem('currentBookingUUID');
      localStorage.removeItem('currentPaymentMethodId');

      setTimeout(() => {
        router.push(`/booking-success?order_uuid=${orderUuidParam}&booking_id=${bookingId}`);
      }, 1500);
      
    } else if (code === "MP02") {
      setStatus("cancelled");
      toast.error("⏹️ تم إلغاء عملية الدفع");
      
      setTimeout(() => {
        router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=تم إلغاء الدفع من قبل المستخدم&cancelled=true`);
      }, 1500);
      
    } else if (isUpdated && !isPaymentSuccess) {
      setStatus("failed");
      toast.error("❌ فشل الدفع");
      
      setTimeout(() => {
        router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=تم رفض الدفع من البنك (${code})`);
      }, 1500);
      
    } else {
      setStatus("failed");
      toast.error("❌ فشل تحديث حالة الدفع");

      setTimeout(() => {
        router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=فشل تحديث حالة الدفع`);
      }, 1500);
    }
  };

  // ============================================
  // 1️⃣1️⃣ معالجة Callback من Paymob
  // ============================================
  const handlePaymobCallback = async (params: Record<string, string>) => {
    console.log("🔄 Processing Paymob Callback...");

    const id = searchParams.get("id");
    const success = searchParams.get("success");
    const pending = searchParams.get("pending");
    const order = searchParams.get("order");
    const txnResponseCode = searchParams.get("txn_response_code");
    const acqResponseCode = searchParams.get("acq_response_code");
    const responseMessage = searchParams.get("data.message");
    const errorOccured = searchParams.get("error_occured");
    const subType = searchParams.get("source_data.sub_type");
    const pan = searchParams.get("source_data.pan");
    
    const orderUuidParam = searchParams.get("order_uuid");
    const paymentMethodId = searchParams.get("payment_method_id");
    const bookingId = searchParams.get("booking_id");

    setOrderUuid(orderUuidParam);

    let isPaymentSuccess = false;
    let paymentStatusText = "failed";

    if (success === "true" && pending === "false") {
      isPaymentSuccess = true;
      paymentStatusText = "paid";
    }

    if (txnResponseCode === "APPROVED" || acqResponseCode === "00") {
      isPaymentSuccess = true;
      paymentStatusText = "paid";
    }

    if (responseMessage === "Approved" || responseMessage === "approved") {
      isPaymentSuccess = true;
      paymentStatusText = "paid";
    }

    if (errorOccured === "true") {
      isPaymentSuccess = false;
      paymentStatusText = "failed";
    }

    console.log(`💰 Paymob Status: ${isPaymentSuccess ? 'SUCCESS ✅' : 'FAILED ❌'}`);

    if (!orderUuidParam || !paymentMethodId) {
      console.error("❌ Missing order_uuid or payment_method_id");
      toast.error("بيانات غير مكتملة");
      setStatus("failed");
      setIsProcessing(false);
      return;
    }

    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }

    if (!token) {
      console.error("❌ No token found");
      toast.error("❌ يرجى تسجيل الدخول مرة أخرى");
      setStatus("failed");
      setIsProcessing(false);
      return;
    }

    const paymentResponse = {
      provider: "paymob",
      transaction_id: id,
      order_id: order,
      success: success === "true",
      pending: pending === "true",
      error_occured: errorOccured === "true",
      card_type: subType || "Unknown",
      card_last_four: pan || "****",
      response_code: acqResponseCode || txnResponseCode,
      response_message: responseMessage || txnResponseCode,
      booking_id: bookingId,
      payment_method_id: paymentMethodId,
      raw: params,
    };

    console.log("📤 Updating Paymob payment with response:", paymentResponse);

    const isUpdated = await UpdatePaymentStatusService.updatePaymentStatus(
      {
        order_uuid: orderUuidParam,
        payment_status: paymentStatusText,
        payment_method_id: parseInt(paymentMethodId),
        response: paymentResponse,
      },
      token,
    );

    if (isUpdated && isPaymentSuccess) {
      setStatus("success");
      toast.success("✅ تم الدفع بنجاح");
      localStorage.removeItem('currentBookingUUID');
      localStorage.removeItem('currentPaymentMethodId');

      setTimeout(() => {
        router.push(`/booking-success?order_uuid=${orderUuidParam}&booking_id=${bookingId}`);
      }, 1500);
      
    } else if (isUpdated && !isPaymentSuccess) {
      setStatus("failed");
      toast.error("❌ فشل الدفع");
      
      setTimeout(() => {
        router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=تم رفض الدفع من البنك`);
      }, 1500);
      
    } else {
      setStatus("failed");
      toast.error("❌ فشل تحديث حالة الدفع");

      setTimeout(() => {
        router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=فشل تحديث حالة الدفع`);
      }, 1500);
    }
  };

  // ============================================
  // 1️⃣2️⃣ معالجة Callback عام
  // ============================================
  const handleGenericCallback = async (params: Record<string, string>) => {
    console.log("🔄 Processing Generic Callback...");

    const orderUuidParam = searchParams.get("order_uuid");
    const paymentStatus = searchParams.get("payment_status");
    const paymentMethodId = searchParams.get("payment_method_id");
    const bookingId = searchParams.get("booking_id");

    setOrderUuid(orderUuidParam);

    if (!orderUuidParam || !paymentMethodId) {
      console.error("❌ Missing order_uuid or payment_method_id");
      toast.error("بيانات غير مكتملة");
      setStatus("failed");
      setIsProcessing(false);
      return;
    }

    let token = localStorage.getItem("token");
    if (!token) {
      token = sessionStorage.getItem("token");
    }

    if (!token) {
      console.error("❌ No token found");
      toast.error("❌ يرجى تسجيل الدخول مرة أخرى");
      setStatus("failed");
      setIsProcessing(false);
      return;
    }

    const isSuccess = paymentStatus === "paid" || paymentStatus === "success";
    const paymentStatusText = isSuccess ? "paid" : "failed";

    const paymentResponse = {
      provider: "generic",
      payment_status: paymentStatus,
      booking_id: bookingId,
      payment_method_id: paymentMethodId,
      raw: params,
    };

    const isUpdated = await UpdatePaymentStatusService.updatePaymentStatus(
      {
        order_uuid: orderUuidParam,
        payment_status: paymentStatusText,
        payment_method_id: parseInt(paymentMethodId),
        response: paymentResponse,
      },
      token,
    );

    if (isUpdated && isSuccess) {
      setStatus("success");
      toast.success("✅ تم الدفع بنجاح");
      localStorage.removeItem('currentBookingUUID');
      localStorage.removeItem('currentPaymentMethodId');

      setTimeout(() => {
        router.push(`/booking-success?order_uuid=${orderUuidParam}&booking_id=${bookingId}`);
      }, 1500);
    } else {
      setStatus("failed");
      toast.error("❌ فشل الدفع");
      
      setTimeout(() => {
        router.push(`/payment-failed?order_uuid=${orderUuidParam}&error_message=فشل الدفع`);
      }, 1500);
    }
  };

  // ============================================
  // 1️⃣3️⃣ عرض حالة المعالجة
  // ============================================
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
            {paymentProvider !== "unknown" && (
              <p className="text-sm text-gray-400 mt-2">
                المزود: {paymentProvider === "mispay" ? "MIS Pay" : paymentProvider === "tamara" ? "Tamara" : "Paymob"}
              </p>
            )}
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
            <h2 className="text-2xl font-bold text-green-600">✅ تم الدفع بنجاح!</h2>
            <p className="text-gray-600 mt-2">سيتم توجيهك إلى صفحة الحجز...</p>
          </>
        ) : status === "cancelled" ? (
          <>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
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
            <h2 className="text-2xl font-bold text-yellow-600">⏹️ تم إلغاء الدفع</h2>
            <p className="text-gray-600 mt-2">يمكنك المحاولة مرة أخرى في أي وقت</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90"
            >
              المحاولة مرة أخرى
            </button>
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
            <h2 className="text-2xl font-bold text-red-600">❌ فشل الدفع</h2>
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