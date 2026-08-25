// src/components/auth/AuthPopup.tsx
'use client';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import AuthLogin from '@/src/components/auth/AuthLogin';
import AuthRegister from '@/src/components/auth/AuthRegister';

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export default function AuthPopup({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  onSuccess 
}: AuthPopupProps) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
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
    onClose();
  };

  const handleAuthSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    handleClose();
  };

  const switchToRegister = () => {
    setMode('register');
  };

  const switchToLogin = () => {
    setMode('login');
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
          {mode === 'login' ? (
            <AuthLogin 
              onSwitchToRegister={switchToRegister}
              onSuccess={handleAuthSuccess}
            />
          ) : (
            <AuthRegister 
              onSwitchToLogin={switchToLogin}
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}