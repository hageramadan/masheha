// src/hooks/useExtendBooking.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/src/context/AuthContext";
import {
  PaymentService,
  PaymentMethodType,
} from "@/src/services/paymentService";
import { UpdatePaymentStatusService } from "@/src/services/updatePaymentStatusService";
import { extendBooking } from "@/src/services/bookingApiService";

interface UseExtendBookingProps {
  bookingId: number;
  carName: string;
  onSuccess: () => void;
}

// ✅ دالة استخراج الرسالة من الأخطاء
const extractErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;

  if (error?.message) {
    if (typeof error.message === 'string') return error.message;
    if (typeof error.message === 'object' && error.message !== null) {
      if (error.message.message) return error.message.message;
      try {
        return JSON.stringify(error.message);
      } catch {
        return String(error.message);
      }
    }
    return String(error.message);
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.data?.message) {
    return error.data.message;
  }

  return 'حدث خطأ غير متوقع';
};

export const useExtendBooking = ({ bookingId, carName, onSuccess }: UseExtendBookingProps) => {
  const { token } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [extensionData, setExtensionData] = useState<any>(null);

  // دالة تنفيذ التمديد (تسمى بعد نجاح الدفع)
  const executeExtension = useCallback(async (
    days: number,
    paymentMethodId: number,
    uuid: string,
  ) => {
    if (!token) {
      toast.error("⚠️ يرجى تسجيل الدخول أولاً");
      return false;
    }

    try {
      // ✅ استدعاء API التمديد مع payment_method_id و uuid
      const result = await extendBooking(
        bookingId,
        days,
        paymentMethodId,
        uuid,
      );

      // ✅ تحديث حالة الدفع إلى success بعد التمديد
      await UpdatePaymentStatusService.updatePaymentSuccess(
        uuid,
        paymentMethodId,
        {
          payment_type: "card",
          extension_days: days,
          booking_id: bookingId,
          extended: true,
        },
        token,
      );

      toast.success(`✅ تم تمديد الحجز بنجاح لمدة ${days} يوم`, {
        duration: 3000,
        position: "top-center",
      });

      setTimeout(() => {
        onSuccess();
      }, 1500);

      return true;
    } catch (error: any) {
      console.error("❌ Error extending booking:", error);
      const errorMsg = extractErrorMessage(error);
      
      // ❌ تحديث حالة الدفع إلى failed
      await UpdatePaymentStatusService.updatePaymentFailed(
        uuid,
        paymentMethodId,
        { 
          error: errorMsg,
          extension_days: days,
          booking_id: bookingId,
        },
        token,
      );

      toast.error(`❌ ${errorMsg}`);
      return false;
    }
  }, [bookingId, token, onSuccess]);

  // دالة معالجة الدفع والتمديد
  const handleExtendBooking = useCallback(async (
    days: number,
    selectedPaymentMethod: string,
    totalAmount: number,
    priceData: any,
  ) => {
    if (!token) {
      toast.error("⚠️ يرجى تسجيل الدخول أولاً");
      return;
    }

    if (days < 1) {
      toast.error("الرجاء إدخال عدد أيام صحيح");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("الرجاء اختيار طريقة الدفع");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ إنشاء UUID جديد للتمديد
      const uuid = crypto.randomUUID();
      const paymentMethodId = parseInt(selectedPaymentMethod) || 0;
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const callbackUrl = `${baseUrl}/payment-callback`;
      const successUrl = `${baseUrl}/booking-success?type=extension&uuid=${uuid}`;
      const failUrl = `${baseUrl}/payment-failed?type=extension&uuid=${uuid}`;

      // حفظ بيانات التمديد للاستخدام بعد الدفع
      setExtensionData({
        days,
        paymentMethodId,
        totalAmount,
        priceData,
        uuid,
      });

      // 1️⃣ معالجة الدفع
      setIsRedirecting(true);

      const paymentResult = await PaymentService.processPayment(
        {
          car_name: `تمديد حجز ${carName}`,
          amount: totalAmount,
          uuid: uuid,
          zip: "12251",
          address: "تمديد حجز",
          city: "الرياض",
          payment_method: paymentMethodId as PaymentMethodType,
          return_url: successUrl,
          cancel_url: failUrl,
          callback_url: callbackUrl,
          booking_id: bookingId,
        },
        token,
      );

      console.log("📤 Payment Result:", paymentResult);

      if (paymentResult.success) {
        if (paymentResult.isCash) {
          // 🔹 حالة الدفع النقدي: يتم التمديد مباشرة
          // ✅ تنفيذ التمديد مع payment_method_id و uuid
          const extended = await executeExtension(
            days,
            paymentMethodId,
            uuid,
          );

          if (extended) {
            await UpdatePaymentStatusService.updatePaymentSuccess(
              uuid,
              paymentMethodId,
              { 
                payment_type: "cash",
                extension_days: days,
                booking_id: bookingId,
              },
              token,
            );
          }

          setIsRedirecting(false);
          setIsSubmitting(false);
          return;
        } 
        else if (paymentResult.paymentUrl) {
          // 🔹 حالة الدفع الإلكتروني: التوجيه إلى بوابة الدفع
          toast.success("🔄 جاري توجيهك إلى بوابة الدفع...", {
            duration: 3000,
            position: "top-center",
          });

          const paymentUrl = paymentResult.paymentUrl;

          if (!paymentUrl || !paymentUrl.startsWith("http")) {
            toast.error("❌ رابط الدفع غير صالح");
            
            // ❌ تحديث حالة الدفع إلى failed
            await UpdatePaymentStatusService.updatePaymentFailed(
              uuid,
              paymentMethodId,
              { 
                error: "Invalid payment URL",
                extension_days: days,
                booking_id: bookingId,
              },
              token,
            );
            
            setIsRedirecting(false);
            setIsSubmitting(false);
            return;
          }

          // ⚠️ تخزين بيانات التمديد في localStorage لاسترجاعها بعد العودة من الدفع
          localStorage.setItem('pending_extension', JSON.stringify({
            bookingId,
            days,
            uuid,
            paymentMethodId,
            totalAmount,
            priceData,
            timestamp: Date.now(),
          }));

          // التوجيه إلى بوابة الدفع
          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 1000);

          setIsRedirecting(false);
          setIsSubmitting(false);
          return;
        } 
        else {
          // ❌ لا يوجد رابط دفع
          await UpdatePaymentStatusService.updatePaymentFailed(
            uuid,
            paymentMethodId,
            { 
              error: "No payment URL received",
              extension_days: days,
              booking_id: bookingId,
            },
            token,
          );
          toast.error("❌ لم يتم استلام رابط الدفع");
          setIsRedirecting(false);
          setIsSubmitting(false);
          return;
        }
      } else {
        // ❌ فشل معالجة الدفع
        const errorMsg = extractErrorMessage(paymentResult.message);
        await UpdatePaymentStatusService.updatePaymentFailed(
          uuid,
          paymentMethodId,
          { 
            error: errorMsg,
            extension_days: days,
            booking_id: bookingId,
          },
          token,
        );
        toast.error(`❌ ${errorMsg}`);
        setIsRedirecting(false);
        setIsSubmitting(false);
        return;
      }
    } catch (error: any) {
      console.error("❌ Extend booking error:", error);
      const errorMsg = extractErrorMessage(error);
      toast.error(`❌ ${errorMsg}`);
      setIsRedirecting(false);
      setIsSubmitting(false);
    }
  }, [token, bookingId, carName, executeExtension]);

  // دالة معالجة العودة من بوابة الدفع (تسمى في صفحة النجاح)
  const handlePaymentCallback = useCallback(async (uuid: string, paymentStatus: 'success' | 'failed') => {
    // محاولة استرجاع بيانات التمديد من localStorage
    const pendingDataStr = localStorage.getItem('pending_extension');
    if (!pendingDataStr) {
      console.warn("⚠️ No pending extension data found");
      return false;
    }

    try {
      const pendingData = JSON.parse(pendingDataStr);
      
      // التحقق من صحة البيانات
      if (pendingData.uuid !== uuid) {
        console.warn("⚠️ UUID mismatch");
        return false;
      }

      // التحقق من انتهاء الصلاحية (30 دقيقة)
      if (Date.now() - pendingData.timestamp > 30 * 60 * 1000) {
        localStorage.removeItem('pending_extension');
        toast.error("⚠️ انتهت صلاحية الطلب، يرجى المحاولة مرة أخرى");
        return false;
      }

      const { days, paymentMethodId } = pendingData;

      if (paymentStatus === 'success') {
        // ✅ تم الدفع بنجاح → تنفيذ التمديد مع payment_method_id و uuid
        const success = await executeExtension(
          days,
          paymentMethodId,
          uuid,
        );
        
        if (success) {
          localStorage.removeItem('pending_extension');
          
          // ✅ تحديث حالة الدفع إلى success
          await UpdatePaymentStatusService.updatePaymentSuccess(
            uuid,
            paymentMethodId,
            {
              payment_type: "card",
              extension_days: days,
              booking_id: bookingId,
              extended: true,
            },
            token || undefined,
          );
          
          return true;
        }
        return false;
      } else {
        // ❌ فشل الدفع
        await UpdatePaymentStatusService.updatePaymentFailed(
          uuid,
          paymentMethodId,
          {
            error: "Payment failed or cancelled",
            extension_days: days,
            booking_id: bookingId,
          },
          token || undefined,
        );
        localStorage.removeItem('pending_extension');
        toast.error("❌ لم يتم الدفع، يرجى المحاولة مرة أخرى");
        return false;
      }
    } catch (error) {
      console.error("❌ Error processing payment callback:", error);
      localStorage.removeItem('pending_extension');
      return false;
    }
  }, [token, bookingId, executeExtension]);

  return {
    handleExtendBooking,
    handlePaymentCallback,
    isSubmitting,
    isRedirecting,
    extensionData,
  };
};