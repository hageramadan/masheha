'use client';
import { useState } from 'react';
import PhoneInput from '@/src/components/contact/PhoneInput';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/src/context/AuthContext';

interface AuthRegisterProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export default function AuthRegister({ onSwitchToLogin, onSuccess }: AuthRegisterProps) {
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
      const userData = {
        name: name.trim(),
        phone: phoneNumber,
        country_code: countryCode,
      };

      const response = await register(userData);
      
      if (response.result) {
        toast.success('✅ تم إنشاء الحساب بنجاح!');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ أثناء التسجيل');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">انشاء حساب</h1>
        <p className="text-gray-500 mt-2">يرجى إدخال بياناتك لإنشاء حساب</p>
      </div>

      <form onSubmit={handleSubmit}>
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
              جاري إنشاء الحساب...
            </>
          ) : (
            'انشاء حساب'
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          لديك حساب بالفعل؟{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary font-bold hover:underline"
          >
            تسجيل الدخول
          </button>
        </p>
      </div>
    </>
  );
}