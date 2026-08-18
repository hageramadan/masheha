'use client';

import { Car } from '@/src/types/booking';
import { formatCurrency } from '@/src/utils/bookingUtils';
import { FaCar } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

interface BookingSummaryProps {
  car: Car;
  rentalDays: number;
  totals: {
    subtotal: number;
    servicesTotal: number;
    tax: number;
    total: number;
  };
  deliveryFee?: number; // رسوم التوصيل
}

export default function BookingSummary({
  car,
  rentalDays,
  totals,
  deliveryFee = 20, // القيمة الافتراضية 20 ريال
}: BookingSummaryProps) {
  // حساب إجمالي سعر السيارة
  const carTotal = car.pricePerDay * rentalDays;
  
  // حساب الإجمالي النهائي
  const finalTotal = carTotal + totals.servicesTotal + deliveryFee + totals.tax;

  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-base lg:text-lg font-bold text-primary mb-4">ملخص الطلب</h2>

      
        
        <div className='flex justify-between items-center w-full  pb-3 border-b border-gray-200'>
          <p className=" text-gray-500">
            {car.name} {car.year}
          </p>
          <p className="text-base text-primary">
            {formatCurrency(car.pricePerDay)} 
          </p>
        </div>
      

      {/* التفاصيل */}
      <div className="space-y-3 py-2 ">
        <div className="flex justify-between pb-3 border-b border-gray-200 text-sm">
          <span className="text-gray-500">سعر السيارة</span>
          <span className="text-base text-primary">
            {formatCurrency(carTotal)}
          </span>
        </div>
        
        {totals.servicesTotal > 0 && (
          <div className="flex justify-between text-sm  pb-3 border-b border-gray-200">
            <span className="text-gray-500">خدمات إضافية</span>
            <span className="text-base text-primary">
              {formatCurrency(totals.servicesTotal)}
            </span>
          </div>
        )}
        
        {deliveryFee > 0 && (
          <div className="flex justify-between text-sm  pb-3 border-b border-gray-200" >
            <span className="text-gray-500">رسوم التوصيل</span>
            <span className="text-base text-primary">
              {formatCurrency(deliveryFee)}
            </span>
          </div>
        )}
         <div className="flex justify-between text-sm  pb-3 border-b border-gray-200">
          <span className="text-gray-500">الضريبة</span>
          <span className="text-base text-primary">
            {formatCurrency(totals.tax)}
          </span>
        </div>
      </div>

      {/* الإجمالي */}
      <div className="space-y-2 pt-4">
       
        <div className="flex justify-between text-lg font-bold">
          <span>الإجمالي</span>
          <span className="text-primary">{formatCurrency(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
}