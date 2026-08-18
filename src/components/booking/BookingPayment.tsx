'use client';

import { PaymentMethod } from '@/src/types/booking';
import Image from 'next/image';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

interface BookingPaymentProps {
  selectedMethod: string | null;
  onSelect: (id: string) => void;
  error?: string;
}

// تعريف طرق الدفع مباشرة في المكون مع الصور والأسماء
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

export default function BookingPayment({
  selectedMethod,
  onSelect,
  error,
}: BookingPaymentProps) {
  // استخدام القائمة المحددة بدلاً من mockPaymentMethods
  const paymentMethods = paymentMethodsList;

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">
      <h2 className="text-base lg:text-lg font-bold text-primary mb-4">طريقة الدفع</h2>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              className={cn(
                "w-full flex items-center gap-2 p-4  rounded-xl border transition-all duration-100",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-gray-200 hover:border-primary/30 hover:bg-gray-50"
              )}
            >
              {/* الصورة */}
              <div className="w-14 h-auto shrink flex items-center justify-center">
                <Image
                  src={method.image}
                  alt={method.name}
                  width={400}
                  height={400}
                  className="object-contain w-full h-full"
                  onError={(e) => {
                    // في حالة فشل تحميل الصورة، استخدم صورة افتراضية
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
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}