'use client';
import { useState } from 'react';
import PhoneInput from '@/src/components/contact/PhoneInput';
import { toast } from 'sonner';

export default function AuthLogin({ onSwitchToRegister, onOtpSent }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+966');

  const handlePhoneChange = (phone, code) => {
    setPhoneNumber(phone);
    setCountryCode(code);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error('⚠️ يرجى إدخال رقم هاتف صحيح');
      return;
    }
    
    onOtpSent(phoneNumber, countryCode, 'login');
    toast.success('✅ تم إرسال رمز التحقق');
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">تسجيل دخول</h1>
        <p className="text-gray-500 mt-2">يرجى إدخال رقم الهاتف لتسجيل الدخول</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            رقم الهاتف
          </label>
          <PhoneInput
            value={phoneNumber}
            onChange={handlePhoneChange}
            required={true}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          تسجيل الدخول
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          ليس لديك حساب؟{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-primary font-bold hover:underline"
          >
            انشاء حساب
          </button>
        </p>
      </div>
    </>
  );
}