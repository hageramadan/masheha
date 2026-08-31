// src/components/booking/OTPPopup.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface OTPPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<boolean>;
  isLoading: boolean;
  phoneNumber?: string;
  onResend: () => void;
}

export default function OTPPopup({
  isOpen,
  onClose,
  onVerify,
  isLoading,
  phoneNumber,
  onResend,
}: OTPPopupProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // تركيز على أول خانة عند فتح البوب اب
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setIsVerifying(false);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // معالج تغيير كل خانة
  const handleChange = (index: number, value: string) => {
    // السماح فقط بالأرقام
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // الانتقال للخانة التالية تلقائياً
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // معالج المفاتيح (بما في ذلك الأسهم)
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = otp[index];

    // مفتاح Backspace: يمسح الخانة الحالية ويرجع للخانة السابقة
    if (e.key === 'Backspace') {
      if (currentValue) {
        // لو في قيمة، امسحها
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // لو مفيش قيمة، ارجع للخانة السابقة
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
      return;
    }

    // مفتاح Delete: يمسح الخانة الحالية
    if (e.key === 'Delete') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      e.preventDefault();
      return;
    }

    // التنقل بالأسهم (يمين/شمال)
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      
      if (e.key === 'ArrowRight') {
        // انتقل للخانة التي على اليمين (في وضع RTL، اليمين هو التالي)
        if (index < 5) {
          inputRefs.current[index + 1]?.focus();
        }
      } else if (e.key === 'ArrowLeft') {
        // انتقل للخانة التي على اليسار (في وضع RTL، اليسار هو السابق)
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }
      return;
    }

    // مفتاح Enter: ينفذ التحقق
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
      return;
    }

    // منع إدخال أي شيء غير الأرقام
    if (e.key && !/^\d$/.test(e.key) && e.key !== 'Tab') {
      e.preventDefault();
    }
  };

  // معالج Paste (لصق الكود كامل)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (numbers.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < numbers.length && i < 6; i++) {
        newOtp[i] = numbers[i];
      }
      setOtp(newOtp);
      
      // الانتقال للخانة التالية بعد اللصق
      const nextIndex = Math.min(numbers.length, 5);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 10);
    }
  };

  // معالج التحقق
  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.error('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setIsVerifying(true);
    const success = await onVerify(otpCode);
    setIsVerifying(false);
    
    if (success) {
      setOtp(['', '', '', '', '', '']);
    }
  };

  // اختيار النص بالكامل عند الضغط (يسهل النسخ)
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white relative rounded-3xl p-6 lg:p-8 max-w-md w-full mx-4 shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className='flex flex-col items-center justify-center'>
            <h2 className="text-xl font-bold text-gray-800"> رمز التحقق</h2>
            <p className="text-sm text-gray-500 mt-1">
              تم إرسال رمز مكون من 6 أرقام إلى
              <span className="font-bold text-center text-primary block mt-0.5" dir='ltr'>
                {phoneNumber || 'جوالك'}
              </span>
            </p>
          </div>
         
        </div>
         <button
            onClick={onClose}
            className=" absolute top-3 left-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="إغلاق"
          >
            <FaTimes className="text-gray-500 text-xl" />
          </button>

        {/* خانات OTP */}
        <div className="flex justify-center gap-2 lg:gap-3 my-8" dir="ltr">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={handleFocus}
              disabled={isVerifying || isLoading}
              className={`
                w-12 h-14 lg:w-14 lg:h-16 
                text-center text-2xl lg:text-3xl font-bold 
                border-2 rounded-xl 
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                transition-all duration-200
                ${digit ? 'border-primary bg-primary/5' : 'border-gray-200'}
                ${(isVerifying || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
                select-all
              `}
              autoFocus={index === 0}
              dir="ltr"
            />
          ))}
        </div>

       

        {/* أزرار */}
        <div className="space-y-3">
          <button
            onClick={handleVerify}
            disabled={isVerifying || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                جاري التحقق...
              </span>
            ) : (
              ' تحقق'
            )}
          </button>

          <div className="text-center">
            <button
              onClick={onResend}
              disabled={isVerifying || isLoading}
              className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              لم يصلك الرمز؟ أعد الإرسال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}