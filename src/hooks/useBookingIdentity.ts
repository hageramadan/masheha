'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/src/context/AuthContext';
import { emptyRegistrationFields, validateRegistrationFields } from '@/src/components/auth/RegistrationFields';
import type { BookingFormController } from '@/src/types/bookingForm';

export function useBookingIdentity({
  bookingData,
  updateField,
}: Pick<BookingFormController, 'bookingData' | 'updateField'>) {
  const { user, isAuthenticated, register, verifyOtp, resendOtp, clearPendingAuth } = useAuth();
  const [registrationFields, setRegistrationFields] = useState(emptyRegistrationFields);
  const [otpPhone, setOtpPhone] = useState<{ phone: string; country_code: string } | null>(null);
  const [isOTPLoading, setIsOTPLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [phoneInputKey, setPhoneInputKey] = useState(0);

  // ✅ حالة جديدة لتتبع ما إذا تم التحقق من الهوية بالكامل
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);

  // ✅ حالة جديدة لعرض "جاري التحقق"
  const [isVerifying, setIsVerifying] = useState(false);

  // حالة البوب اب
  const [isOTPPopupOpen, setIsOTPPopupOpen] = useState(false);

  // تفريغ رقم الهاتف عند تغيير bookingData.customerPhone
  useEffect(() => {
    if (bookingData.customerPhone) {
      setPhoneNumber(bookingData.customerPhone);
    } else {
      setPhoneNumber("");
      setPhoneInputKey((prev) => prev + 1);
    }
  }, [bookingData.customerPhone]);

  // ملء بيانات المستخدم إذا كان مسجل دخول
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.name) {
        updateField("customerName", user.name);
      }
      if (user.phone) {
        const phone = user.phone.toString();
        setPhoneNumber(phone);
        updateField("customerPhone", phone);
      }
      if (user.country_code) {
        setCountryCode(user.country_code);
      }
      setIsIdentityVerified(true);
    } else {
      setIsIdentityVerified(false);
    }
  }, [isAuthenticated, user, updateField]);

  const handlePhoneChange = (phone: string, code: string) => {
    if (phone === phoneNumber && code === countryCode) return;
    setPhoneNumber(phone);
    setCountryCode(code);
    updateField("customerPhone", phone);
    setIsIdentityVerified(false);
    setOtpPhone(null);
    clearPendingAuth();
    setIsOTPPopupOpen(false);
  };

  const handleVerifyOTPFromPopup = async (code: string): Promise<boolean> => {
    if (!otpPhone) return false;
    setIsOTPLoading(true);
    try {
      await verifyOtp(otpPhone, code);
      setIsIdentityVerified(true);
      setIsOTPPopupOpen(false);
      toast.success("تم التحقق بنجاح");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل التحقق من الرمز");
      return false;
    } finally {
      setIsOTPLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!otpPhone) return false;
    setIsOTPLoading(true);
    try {
      await resendOtp(otpPhone);
      toast.success("تم إعادة إرسال رمز التحقق");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل إعادة إرسال الرمز");
      return false;
    } finally {
      setIsOTPLoading(false);
    }
  };

  const handleVerifyIdentity = async () => {
    if (isIdentityVerified || isVerifying || isOTPLoading) return;
    if (!bookingData.customerName.trim()) {
      toast.error("يرجى إدخال الاسم");
      return;
    }
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 8) {
      toast.error("يرجى إدخال رقم جوال صحيح");
      return;
    }
    if (otpPhone) {
      setIsOTPPopupOpen(true);
      return;
    }
    setIsVerifying(true);
    const credentials = { phone: phoneNumber, country_code: countryCode };
    try {
      const error = validateRegistrationFields(registrationFields);
      if (error) { toast.error(error); return; }
      await register({ ...credentials, ...registrationFields });
      setOtpPhone(credentials);
      setIsOTPPopupOpen(true);
      toast.success("تم إرسال رمز التحقق");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل إرسال رمز التحقق");
    } finally {
      setIsVerifying(false);
    }
  };

  const closeOtpPopup = () => {
    setIsOTPPopupOpen(false);
    setIsVerifying(false);
  };

  return {
    isAuthenticated,
    registrationFields,
    setRegistrationFields,
    phoneNumber,
    countryCode,
    phoneInputKey,
    isIdentityVerified,
    isVerifying,
    isOTPLoading,
    isOTPPopupOpen,
    otpPhone,
    handlePhoneChange,
    handleVerifyIdentity,
    handleVerifyOTPFromPopup,
    handleResendOTP,
    closeOtpPopup,
  };
}
