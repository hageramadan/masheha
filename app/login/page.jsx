'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaUser, FaPhone } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import PhoneInput from '@/src/components/contact/PhoneInput';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+966');

  const handlePhoneChange = (phone, code) => {
    setPhoneNumber(phone);
    setCountryCode(code);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error(' يرجى إدخال رقم هاتف صحيح');
      return;
    }
    
    toast.success('تم إرسال رمز التحقق');
    window.location.href = `/otp?phone=${phoneNumber}&code=${countryCode}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6">
          <FaArrowLeft />
          <span>العودة للرئيسية</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-3xl text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">تسجيل دخول</h1>
            <p className="text-gray-500 mt-2">يرجى إدخال رقم الهاتف لمتابعة عملية التسجيل</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FaPhone className="inline ml-1 text-primary" />
                رقم الهاتف
              </label>
              
              <PhoneInput
                value={phoneNumber}
                onChange={handlePhoneChange}
                required={true}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <FaPhone className="ml-2" />
              تسجيل الدخول
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <Link href="/register" className="text-primary font-bold hover:underline">
                انشاء حساب
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}