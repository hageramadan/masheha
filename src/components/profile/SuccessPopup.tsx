// src/components/profile/SuccessPopup.tsx (مع createPortal من react-dom)
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCheckCircle, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface SuccessPopupProps {
  title: string;
  message: string;
  buttonText?: string;
  onClose?: () => void;
}

export default function SuccessPopup({ 
  title, 
  message, 
  buttonText = 'العودة للرئيسية',
  onClose 
}: SuccessPopupProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleAction = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <FaCheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {message}
        </p>
        <button
          onClick={handleAction}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#012738] text-white rounded-xl hover:bg-[#012738]/90 transition-all hover:scale-[1.02]"
        >
          <FaHome className="h-4 w-4" />
          <span className="font-medium">{buttonText}</span>
        </button>
      </div>
    </div>,
    document.body
  );
}