// src/hooks/usePhoneAuth.ts
import { useState } from 'react';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  Auth,
} from 'firebase/auth';
import { auth } from '@/src/lib/firebase';
import toast from 'react-hot-toast';

// ✅ أضف تعريف للـ window
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
    confirmationResult: ConfirmationResult | null;
  }
}

export const usePhoneAuth = () => {
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);

  // ✅ تهيئة reCAPTCHA غير مرئي
  const setupRecaptcha = (): RecaptchaVerifier | null => {
    if (typeof window === 'undefined') return null;

    try {
      // تنظيف أي reCAPTCHA قديم
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
        window.recaptchaVerifier = null;
      }

      // ✅ تأكد إن الـ container موجود
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        console.error('❌ recaptcha-container not found in DOM');
        return null;
      }

      // ✅ الحل: size: 'invisible' بدل 'visible'
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible', // 🔑 ده اللي يخفيها
        callback: () => {
          console.log('✅ reCAPTCHA solved silently');
        },
        'expired-callback': () => {
          console.log('⏰ reCAPTCHA expired');
          window.recaptchaVerifier = null;
        },
      });

      window.recaptchaVerifier = verifier;
      return verifier;
    } catch (error) {
      console.error('reCAPTCHA setup error:', error);
      return null;
    }
  };

  const sendOTP = async (phone: string) => {
    if (!phone) {
      toast.error('يرجى إدخال رقم الجوال');
      return false;
    }

    setIsLoading(true);
    try {
      const verifier = setupRecaptcha();
      if (!verifier) {
        toast.error('حدث خطأ في تهيئة التحقق');
        return false;
      }

      // ✅ مهم: في الـ invisible mode، لازم تستدعي render قبل signIn
      // (Firebase بيعملها تلقائيًا في معظم الحالات لكن لو حصل مشكلة)
      await verifier.render();

      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(confirmation);
      setIsOTPSent(true);
      return true;
    } catch (error: any) {
      if (error.code === 'auth/invalid-phone-number') {
        toast.error('رقم الجوال غير صحيح');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('طلبات كثيرة، حاول لاحقاً');
      } else if (error.code === 'auth/invalid-app-credential') {
        toast.error('❌ خطأ في المصادقة. تأكد من API Key');
      } else {
        toast.error(error.message || 'فشل إرسال رمز التحقق');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (code: string) => {
    if (!code || code.length < 6) {
      toast.error('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return null;
    }

    if (!confirmationResult) {
      toast.error('لم يتم إرسال رمز التحقق');
      return null;
    }

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(code);
      return result.user;
    } catch (error: any) {
      if (error.code === 'auth/invalid-verification-code') {
        toast.error('رمز التحقق غير صحيح');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('طلبات كثيرة، حاول لاحقاً');
      } else {
        toast.error(error.message || 'فشل التحقق من الرمز');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendOTP,
    verifyOTP,
    confirmationResult,
    isOTPSent,
    isLoading,
  };
};