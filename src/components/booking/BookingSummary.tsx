// src/components/booking/BookingSummary.tsx

"use client";

import { Car } from "@/src/types/booking";
import { formatCurrency } from "@/src/utils/bookingUtils";
import { FaPercent } from "react-icons/fa";
import { FaMoneyBills } from "react-icons/fa6";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";

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
      <div className="bg-[#FCF9F466] border rounded-lg p-3 lg:p-5">
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
    <div className="bg-[#FCF9F466] border rounded-lg p-3 lg:p-5">
      <h2 className="text-base lg:text-lg font-bold text-primary mb-4">
        ملخص الطلب
      </h2>

      <div className="flex justify-between items-center w-full pb-1">
      
        <div className="flex items-center gap-1">
          <div className="p-1 rounded-full">
            <FaMoneyBills className="w-5 h-5 text-[#4b398e] " />
          </div>

          <span className="text-gray-600">السعر الأساسي</span>
        </div>
        <p className="text-[#4b398e] text-sm font-bold">
          {formatCurrency(totals.basePrice || carTotal)}
        </p>
      </div>

      <div className="space-y-3 py-2">
        {showPriceBreakdown && (
          <>
            {totals.discount > 0 && (
              <div className="flex justify-between text-sm pb-1 ">
                <span className="text-gray-500">الخصم</span>
                <span className="text-[#4b398e] text-sm font-bold">
                  -{formatCurrency(totals.discount)}
                </span>
              </div>
            )}

            {totals.couponDiscount > 0 && (
              <div className="flex justify-between text-sm pb-1 ">
                <span className="text-gray-500">خصم الكوبون</span>
                <span className="text-[#4b398e] text-sm font-bold">
                  -{formatCurrency(totals.couponDiscount)}
                </span>
              </div>
            )}
          </>
        )}

        {totals.servicesTotal > 0 && (
          <div className="flex justify-between text-sm pb-1 ">
            <div className="flex items-center gap-1">
              <div className="p-1 rounded-full">
                <LiaMoneyBillWaveSolid className="w-5 h-5 text-[#4b398e] " />
              </div>

              <span className="text-gray-600">رسوم الخدمات الاضافية</span>
            </div>
          
            <p className="text-[#4b398e] text-sm font-bold">
              {formatCurrency(totals.servicesTotal)}
            </p>
          </div>
        )}

       

        {/* {totals.tax > 0 && (
          <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
            <div className="flex items-center gap-1">
              <div className="p-1 rounded-full">
                <FaPercent className="w-4 h-4 text-[#4b398e] " />
              </div>

              <span className="text-gray-600">ضريبة القيمة المضافة</span>
            </div>
      
            <span className="text-[#4b398e] text-sm font-bold">
              {formatCurrency(totals.tax)}
            </span>
          </div>
        )} */}
          <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
            <div className="flex items-center gap-1">
              <div className="p-1 rounded-full">
                <FaPercent className="w-4 h-4 text-[#4b398e] " />
              </div>

              <span className="text-gray-600">ضريبة القيمة المضافة</span>
            </div>
      
            <span className="text-[#4b398e] text-sm font-bold">
              {formatCurrency(totals.tax)}
            </span>
          </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-lg font-bold">
          <span className="text-[#1b1b1b] text-base font-bold">الإجمالي</span>
          <span className="text-[#4b398e] text-base font-bold">
            {formatCurrency(finalTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
