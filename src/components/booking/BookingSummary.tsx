'use client';

import { Car } from '@/src/types/booking';
import { formatCurrency } from '@/src/utils/bookingUtils';
import { FaCar } from 'react-icons/fa';

interface BookingSummaryProps {
  car: Car;
  rentalDays: number;
  totals: {
    subtotal: number;
    servicesTotal: number;
    tax: number;
    total: number;
  };
}

export default function BookingSummary({
  car,
  rentalDays,
  totals,
}: BookingSummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 ">
      <h2 className="text-xl font-bold text-gray-800 mb-6">ملخص الطلب</h2>

      {/* السيارة */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <FaCar className="text-2xl text-gray-400" />
        </div>
        <div>
          <p className="font-bold text-gray-800">{car.name}</p>
          <p className="text-sm text-gray-500">
            {formatCurrency(car.pricePerDay)} / اليوم
          </p>
        </div>
      </div>

      {/* التفاصيل */}
      <div className="space-y-3 py-4 border-b border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">عدد الأيام</span>
          <span className="font-bold text-gray-800">{rentalDays} أيام</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">سعر السيارة</span>
          <span className="font-bold text-gray-800">
            {formatCurrency(car.pricePerDay * rentalDays)}
          </span>
        </div>
        {totals.servicesTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">الخدمات الإضافية</span>
            <span className="font-bold text-gray-800">
              {formatCurrency(totals.servicesTotal)}
            </span>
          </div>
        )}
      </div>

      {/* الإجمالي */}
      <div className="space-y-2 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">الضريبة</span>
          <span className="font-bold text-gray-800">{formatCurrency(totals.tax)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>الإجمالي</span>
          <span className="text-primary">{formatCurrency(totals.total)}</span>
        </div>
      </div>
    </div>
  );
}