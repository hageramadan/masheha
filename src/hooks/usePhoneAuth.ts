// src/hooks/usePhoneAuth.ts
import { useState, useEffect } from 'react';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/src/lib/firebase';
import toast from 'react-hot-toast';

export const usePhoneAuth = () => {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);

  // ✅ تهيئة reCAPTCHA
  const setupRecaptcha = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      // ✅ تنظيف أي reCAPTCHA قديم
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
        window.recaptchaVerifier = null;
      }

      // ✅ إنشاء reCAPTCHA جديد مع إعدادات واضحة
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'visible', // ✅ جرب visible بدل invisible
        callback: () => {
          console.log('✅ reCAPTCHA solved');
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
      // ✅ تهيئة reCAPTCHA
      const verifier = setupRecaptcha();
      if (!verifier) {
        toast.error('حدث خطأ في تهيئة التحقق');
        return false;
      }
      
      // console.log('📤 Sending OTP to:', phone);
      
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(confirmation);
      setIsOTPSent(true);
      // toast.success('✅ تم إرسال رمز التحقق إلى جوالك');
      return true;
    } catch (error: any) {
      // console.error('❌ Send OTP error:', error);
      
      if (error.code === 'auth/invalid-phone-number') {
        toast.error('رقم الجوال غير صحيح');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('طلبات كثيرة، حاول لاحقاً');
      } else if (error.code === 'auth/invalid-app-credential') {
        toast.error('❌ خطأ في المصادقة. تأكد من API Key');
        console.error('🔑 تأكد من API Key في Firebase Console > Project Settings > Your apps > masheha-web');
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
      // toast.success('✅ تم التحقق بنجاح');
      return result.user;
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error);
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