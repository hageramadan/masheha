'use client';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';
import AuthLogin from '@/src/components/auth/AuthLogin';
import AuthRegister from '@/src/components/auth/AuthRegister';
import AuthOtp from '@/src/components/auth/AuthOtp';

export default function AuthPopup({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [showOtp, setShowOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+966');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowOtp(false);
      setPhoneNumber('');
      setCountryCode('+966');
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setShowOtp(false);
    setPhoneNumber('');
    onClose();
  };

  const handleOtpSent = (phone, code, authMode) => {
    setPhoneNumber(phone);
    setCountryCode(code);
    setMode(authMode);
    setShowOtp(true);
  };

  const handleOtpSuccess = (authMode) => {
    if (authMode === 'register') {
      toast.success('✅ تم إنشاء الحساب بنجاح!');
    } else {
      toast.success('✅ تم تسجيل الدخول بنجاح!');
    }
    handleClose();
  };

  const switchToRegister = () => {
    setMode('register');
    setShowOtp(false);
    setPhoneNumber('');
  };

  const switchToLogin = () => {
    setMode('login');
    setShowOtp(false);
    setPhoneNumber('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <FaTimes className="text-2xl" />
        </button>

        <div className="p-8 md:p-10">
          {!showOtp ? (
            mode === 'login' ? (
              <AuthLogin 
                onSwitchToRegister={switchToRegister}
                onOtpSent={handleOtpSent}
              />
            ) : (
              <AuthRegister 
                onSwitchToLogin={switchToLogin}
                onOtpSent={handleOtpSent}
              />
            )
          ) : (
            <AuthOtp 
              phoneNumber={phoneNumber}
              countryCode={countryCode}
              mode={mode}
              onBack={() => setShowOtp(false)}
              onSuccess={handleOtpSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}