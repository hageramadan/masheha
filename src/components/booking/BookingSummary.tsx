// src/components/booking/BookingSummary.tsx

"use client";

import { Car } from "@/src/types/booking";
import { formatCurrency } from "@/src/utils/bookingUtils";

interface BookingSummaryProps {
  car: Car;
  rentalDays: number;
  totals: {
    subtotal: number;
    servicesTotal: number;
    tax: number;
    total: number;
    basePrice: number;
    discount: number;
    couponDiscount: number;
    totalDays: number;
  };
  deliveryFee?: number;
  showPriceBreakdown?: boolean;
  isCalculating?: boolean; 
}

export default function BookingSummary({
  car,
  rentalDays,
  totals,
  deliveryFee = 0,
  showPriceBreakdown = true,
  isCalculating = false, 
}: BookingSummaryProps) {
  
  if (isCalculating) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-base lg:text-lg font-bold text-primary mb-4">
          ملخص الطلب
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        
        </div>
      </div>
    );
  }

  const carTotal = totals.basePrice || car.pricePerDay * rentalDays;

  const finalTotal =
    totals.total || carTotal + totals.servicesTotal + deliveryFee + totals.tax;

  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-base lg:text-lg font-bold text-primary mb-4">
        ملخص الطلب
      </h2>

      <div className="flex justify-between items-center w-full pb-3 border-b border-gray-200">
        <p className="text-gray-500">
          {car.name} {car.year}
        </p>
        <p className="text-base text-primary">
          {formatCurrency(totals.basePrice || carTotal)}
        </p>
      </div>

      <div className="space-y-3 py-2">
        {showPriceBreakdown && (
          <>
            {totals.discount > 0 && (
              <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
                <span className="text-gray-500">الخصم</span>
                <span className="text-base text-red-500">
                  -{formatCurrency(totals.discount)}
                </span>
              </div>
            )}

            {totals.couponDiscount > 0 && (
              <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
                <span className="text-gray-500">خصم الكوبون</span>
                <span className="text-base text-red-500">
                  -{formatCurrency(totals.couponDiscount)}
                </span>
              </div>
            )}
          </>
        )}

        {totals.servicesTotal > 0 && (
          <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
            <span className="text-gray-500">خدمات إضافية</span>
            <span className="text-base text-primary">
              {formatCurrency(totals.servicesTotal)}
            </span>
          </div>
        )}

        {deliveryFee > 0 && (
          <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
            <span className="text-gray-500">رسوم التوصيل</span>
            <span className="text-base text-primary">
              {formatCurrency(deliveryFee)}
            </span>
          </div>
        )}

        {totals.tax > 0 && (
          <div className="flex justify-between text-sm pb-3 border-b border-gray-200">
            <span className="text-gray-500">الضريبة</span>
            <span className="text-base text-primary">
              {formatCurrency(totals.tax)}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2 pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>الإجمالي</span>
          <span className="text-primary">{formatCurrency(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
}