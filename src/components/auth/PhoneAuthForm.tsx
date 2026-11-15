'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/src/context/AuthContext';
import PhoneInput from '../contact/PhoneInput';
import OTPPopup from '../booking/OTPPopup';
import RegistrationFields, { emptyRegistrationFields, validateRegistrationFields } from './RegistrationFields';

export default function PhoneAuthForm({ mode, onSwitch, onSuccess }: {
  mode: 'login' | 'register';
  onSwitch: () => void;
  onSuccess?: () => void;
}) {
  const { register, verifyOtp, resendOtp, clearPendingAuth } = useAuth();
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [fields, setFields] = useState(emptyRegistrationFields);
  const [pendingPhone, setPendingPhone] = useState<{ phone: string; country_code: string } | null>(null);
  const [otpOpen, setOtpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const reportError = (error: unknown) => toast.error(error instanceof Error ? error.message : 'تعذر إتمام الطلب');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    if (phone.replace(/\D/g, '').length < 8) { toast.error('يرجى إدخال رقم هاتف صحيح'); return; }
    if (pendingPhone) { setOtpOpen(true); return; }
    setLoading(true);
    const credentials = { phone, country_code: countryCode };
    try {
      const error = validateRegistrationFields(fields);
      if (error) { toast.error(error); return; }
      await register({ ...credentials, ...fields });
      setPendingPhone(credentials);
      setOtpOpen(true);
      toast.success('تم إرسال رمز التحقق');
    } catch (error) { reportError(error); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{mode === 'register' ? 'إنشاء حساب' : 'تسجيل الدخول'}</h1>
        <p className="text-gray-500 mt-2">أدخل بياناتك للمتابعة وتأكيد رقم الجوال برمز التحقق</p>
      </div>
      <form onSubmit={submit} className="space-y-5">
        <fieldset disabled={loading} className="space-y-5">
          <label className="block text-sm font-bold text-gray-700">رقم الجوال *</label>
          <PhoneInput value={phone} countryCode={countryCode} onChange={(nextPhone, code) => {
            setPhone(nextPhone);
            setCountryCode(code);
            setPendingPhone(null);
            clearPendingAuth();
          }} required />
          <RegistrationFields value={fields} onChange={(value) => {
            setFields(value);
            setPendingPhone(null);
            clearPendingAuth();
          }} />
        </fieldset>
        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-bold disabled:opacity-50">
          {loading ? 'جاري الإرسال...' : 'متابعة'}
        </button>
      </form>
      <button type="button" onClick={() => { clearPendingAuth(); onSwitch(); }} className="block mx-auto mt-6 text-primary font-bold">
        {mode === 'register' ? 'لديك حساب؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب'}
      </button>
      <OTPPopup isOpen={otpOpen} onClose={() => setOtpOpen(false)} isLoading={loading}
        phoneNumber={pendingPhone ? `${pendingPhone.country_code}${pendingPhone.phone.replace(/^0/, '')}` : ''}
        onVerify={async (otp) => {
          if (!pendingPhone) return false;
          setLoading(true);
          try {
            await verifyOtp(pendingPhone, otp);
            setOtpOpen(false);
            toast.success('تم تسجيل الدخول بنجاح');
            onSuccess?.();
            return true;
          } catch (error) { reportError(error); return false; }
          finally { setLoading(false); }
        }}
        onResend={async () => {
          if (!pendingPhone) return false;
          setLoading(true);
          try { await resendOtp(pendingPhone); toast.success('تم إعادة إرسال رمز التحقق'); return true; }
          catch (error) { reportError(error); return false; }
          finally { setLoading(false); }
        }}
      />
    </>
  );
}
