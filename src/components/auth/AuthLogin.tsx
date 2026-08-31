/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import PhoneInput from '@/src/components/contact/PhoneInput';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/src/context/AuthContext';

interface AuthLoginProps {
  onSwitchToRegister: () => void;
  onSuccess?: () => void;
}

export default function AuthLogin({ onSwitchToRegister, onSuccess }: AuthLoginProps) {
  const { register } = useAuth(); 
  const [name, setName] = useState(''); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (phone: string, code: string) => {
    setPhoneNumber(phone);
    setCountryCode(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error(' يرجى إدخال الاسم');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error(' يرجى إدخال رقم هاتف صحيح');
      return;
    }
    
    setIsLoading(true);
    try {
      // استدعاء register بدلاً من loginWithPhone
      const userData = {
        name: name.trim(),
        phone: phoneNumber,
        country_code: countryCode,
      };
      
      const response = await register(userData);
      
      if (response.result) {
        toast.success('تم تسجيل الدخول بنجاح!');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">تسجيل دخول</h1>
        <p className="text-gray-500 mt-2">يرجى إدخال رقم الهاتف لتسجيل الدخول</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* حقل الاسم */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            الاسم
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك"
            className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-primary border-gray-200"
          />
        </div>

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
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              جاري تسجيل الدخول...
            </>
          ) : (
            'تسجيل الدخول'
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          ليس لديك حساب؟{' '}
          <button
            type="button"
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