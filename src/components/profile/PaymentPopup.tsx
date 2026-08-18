// src/components/profile/PaymentPopup.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { cn } from '@/src/lib/utils';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (methodId: string) => void;
  selectedMethod: string | null;
}

const paymentMethodsList = [
  { 
    id: 'visa', 
    name: 'فيزا/ماستر', 
    image: '/images/payment/visa.png' 
  },
  { 
    id: 'mada', 
    name: 'مدى', 
    image: '/images/payment/mada.png' 
  },
  { 
    id: 'applePay', 
    name: 'ابل باي', 
    image: '/images/payment/applePay.png' 
  },
  { 
    id: 'tabby', 
    name: 'تابي', 
    image: '/images/payment/tabby.png' 
  },
  { 
    id: 'tamara', 
    name: 'تمارا', 
    image: '/images/payment/tamara.png' 
  },
];

export default function PaymentPopup({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedMethod 
}: PaymentPopupProps) {
  const [tempSelected, setTempSelected] = useState<string | null>(selectedMethod);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تحديث التحديد المؤقت عند تغيير selectedMethod من الخارج
  // استخدام useRef لتجنب التحديثات غير الضرورية
  useEffect(() => {
    // فقط تحديث إذا كان هناك تغيير فعلي
    if (selectedMethod !== tempSelected) {
      setTempSelected(selectedMethod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMethod]);

  // منع التمرير عند ظهور الـ Popup
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

  const handleConfirm = () => {
    if (tempSelected) {
      setIsSubmitting(true);
      setTimeout(() => {
        onSelect(tempSelected);
        setIsSubmitting(false);
        onClose();
      }, 1000);
    }
  };

  // إعادة تعيين التحديد عند فتح الـ Popup
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempSelected(selectedMethod);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* رأس الـ Popup */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">طريقة الدفع</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* قائمة طرق الدفع */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[350px]">
          {paymentMethodsList.map((method) => {
            const isSelected = tempSelected === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setTempSelected(method.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-gray-200 hover:border-primary/30 hover:bg-gray-50"
                )}
              >
                {/* الصورة */}
                <div className="w-12 h-12 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                  <Image
                    src={method.image}
                    alt={method.name}
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/payment/visa.png';
                    }}
                  />
                </div>

                {/* الاسم */}
                <span className="flex-1 text-right font-medium text-gray-800">
                  {method.name}
                </span>

                {/* الدائرة */}
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-gray-300 bg-white"
                )}>
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-3 p-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!tempSelected || isSubmitting}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all hover:scale-[1.02]",
              tempSelected && !isSubmitting
                ? "bg-[#012738] text-white hover:bg-[#012738]/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                جاري المعالجة...
              </>
            ) : (
              <>
                <FaCheck className="h-4 w-4" />
                <span>تأكيد</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}