'use client';
import { useState, useEffect, useRef } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'sonner';

export default function AuthOtp({ 
  phoneNumber, 
  countryCode, 
  mode, 
  onBack, 
  onSuccess 
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const [isResend, setIsResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResend(true);
    }
  }, [timer]);

  // التركيز على أول حقل عند التحميل
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // ✅ دالة معالجة الـ Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbersOnly = pastedData.replace(/[^\d]/g, '');
    
    if (numbersOnly.length >= 6) {
      const otpArray = numbersOnly.slice(0, 6).split('');
      setOtp(otpArray);
      
      // التركيز على آخر حقل تم ملؤه
      const lastIndex = Math.min(otpArray.length - 1, 5);
      if (inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex].focus();
      }
    }
  };

  // ✅ دالة التنقل بين الحقول (يمين ويسار)
  const handleOtpChange = (index, value) => {
    // السماح فقط بالأرقام
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // الانتقال إلى الحقل التالي (من اليمين لليسار في RTL)
    if (value && index < 5) {
      // في RTL، التنقل يكون من اليمين إلى اليسار
      const nextIndex = index + 1;
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    }
  };

  // ✅ دالة التنقل بالأسهم (يمين ويسار)
  const handleKeyDown = (index, e) => {
    const currentValue = otp[index];
    
    // Backspace: حذف الرقم والانتقال للخلف
    if (e.key === 'Backspace') {
      if (currentValue) {
        // إذا كان الحقل يحتوي على رقم، احذفه
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // إذا كان الحقل فارغاً، انتقل للحقل السابق
        const prevIndex = index - 1;
        if (inputRefs.current[prevIndex]) {
          inputRefs.current[prevIndex].focus();
        }
      }
      return;
    }

    // ✅ التنقل بالأسهم في اتجاه RTL
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // في RTL، السهم الأيسر يعني الانتقال إلى اليمين (التالي)
      if (index < 5) {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
      return;
    }

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      // في RTL، السهم الأيمن يعني الانتقال إلى اليسار (السابق)
      if (index > 0) {
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      }
      return;
    }

    // منع إدخال أي شيء غير أرقام
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Tab') {
      return;
    }

    if (!/^\d$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.error('⚠️ يرجى إدخال الرمز المكون من 6 أرقام');
      return;
    }
    
    onSuccess(mode);
  };

  const handleResend = () => {
    setTimer(59);
    setIsResend(false);
    toast.success('📨 تم إعادة إرسال الرمز');
  };

  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6"
      >
        <FaArrowLeft />
        <span>رجوع</span>
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {mode === 'login' ? 'تسجيل دخول' : 'انشاء حساب'}
        </h1>
        <p className="text-gray-500 mt-2">
          {mode === 'login'
            ? 'أدخل الرمز لتأكيد تسجيل الدخول'
            : 'أدخل الرمز لتأكيد إنشاء الحساب'
          }
        </p>
        <p className="text-primary font-bold text-lg mt-1" dir="ltr">
          {countryCode} {phoneNumber}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-3 mb-8" dir="ltr">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-gray-50 focus:ring-2 focus:ring-primary/20"
              dir="ltr"
              autoComplete="one-time-code"
            />
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500">
            {timer > 0 ? (
              <span dir="ltr">00:{timer.toString().padStart(2, '0')}</span>
            ) : (
              <span className="text-red-500">انتهى الوقت</span>
            )}
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={!isResend}
            className={`text-sm font-bold transition-colors ${
              isResend
                ? 'text-primary hover:underline'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            لم تستلم الرمز؟ اعادة ارسال
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          {mode === 'login' ? 'تسجيل الدخول' : 'انشاء حساب'}
        </button>
      </form>
    </>
  );
}