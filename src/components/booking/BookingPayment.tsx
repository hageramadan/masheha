'use client';

import { PaymentMethod } from '@/src/types/booking';
import { mockPaymentMethods } from '@/src/data/mock/mockServices';
import { FaCheck } from 'react-icons/fa';

interface BookingPaymentProps {
  selectedMethod: string | null;
  onSelect: (id: string) => void;
  error?: string;
}

export default function BookingPayment({
  selectedMethod,
  onSelect,
  error,
}: BookingPaymentProps) {
  const paymentMethods: PaymentMethod[] = mockPaymentMethods;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">طرق الدفع</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              selectedMethod === method.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/30'
            }`}
          >
            <div className="text-center">
              <p className="font-bold text-gray-800 text-sm">{method.name}</p>
            </div>
            {selectedMethod === method.id && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <FaCheck className="text-white text-xs" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}