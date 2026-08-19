// src/components/profile/BookingDetails.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaClock,
  FaRoad,
  FaCar,
  FaCalendarAlt,
  FaCreditCard,
} from "react-icons/fa";
import { cn } from "@/src/lib/utils";
import ExtendBooking from "./ExtendBooking";
import { FaRotateRight } from "react-icons/fa6";
import { RiArrowRightSLine } from "react-icons/ri";
import PaymentPopup from './PaymentPopup';

interface BookingDetailsProps {
  booking: {
    id: number;
    date: string;
    price: number;
    type: string;
    location: string;
    kilometers: number;
    pickupTime: string;
    status: string;
    carImage: string;
    carName: string;
    pickupLocation: string;
    dropoffLocation: string;
    bookingNumber: string;
    rentalDays?: number;
    pickupDate?: string;
    returnDate?: string;
    deliveryMethod?: string;
    deliveryNote?: string;
    subtotal?: number;
    tax?: number;
    total?: number;
  };
  onBack: () => void;
}

export default function BookingDetails({
  booking,
  onBack,
}: BookingDetailsProps) {
  const [showExtend, setShowExtend] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // أنيميشن عند تحميل المكون
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // بيانات افتراضية إذا لم تكن موجودة
  const rentalDays = booking.rentalDays || 4;
  const pickupDate = booking.pickupDate || "الاحد، 8 يونيو، 9:30 ص";
  const returnDate = booking.returnDate || "الخميس، 12 يونيو، 9:30 ص";
  const deliveryMethod = booking.deliveryMethod || "توصيل الي موقعك الحالي";
  const deliveryNote =
    booking.deliveryNote || "Lorem ipsum dolor sit amet consectetur.";
  const subtotal = booking.subtotal || 440;
  const tax = booking.tax || 40;
  const total = booking.total || 115;

  const handleRenew = () => {
    setShowExtend(true);
  };

  const handlePaymentSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    console.log('تم اختيار طريقة الدفع:', methodId);
  };

  const handleExtend = (days: number) => {
    console.log(`تم تمديد الحجز لمدة ${days} يوم`);
    setShowExtend(false);
  };

  const handleRefund = () => {
    setShowPaymentPopup(true);
  };

  // إذا كان في وضع التمديد
  if (showExtend) {
    return (
      <ExtendBooking
        booking={{
          id: booking.id,
          bookingNumber: booking.bookingNumber,
          carName: booking.carName,
          returnDate: returnDate,
          rentalDays: rentalDays,
        }}
        onBack={() => setShowExtend(false)}
        onExtend={handleExtend}
      />
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* زر العودة */}
      <button
        onClick={onBack}
        className={cn(
          "flex items-center text-gray-600 hover:text-[#012738] transition-colors py-2",
          "transform transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
      >
        <RiArrowRightSLine className="text-3xl" />
        <span className="text-base lg:text-lg text-primary">تفاصيل</span>
      </button>

      {/* بطاقة تفاصيل الحجز */}
      <div
        className={cn(
          "bg-white rounded-2xl shadow-xl p-6 space-y-6",
          "transform transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* صورة السيارة ومعلوماتها */}
        <div
          className={cn(
            "flex items-center gap-4 shadow-lg p-2 rounded-2xl",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="w-28 h-24 lg:w-32 lg:h-28 shrink-0 overflow-hidden">
            <Image
              src={booking.carImage}
              alt={booking.carName}
              width={128}
              height={112}
              className="object-contain w-full h-full"
            />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-800 text-base lg:text-lg">
                {booking.type}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-sm lg:text-xl font-bold text-primary">
                  {booking.price}
                </span>
                <Image
                  src="/images/SAR.png"
                  alt="sar"
                  width={30}
                  height={30}
                  className="w-4 h-4 lg:w-5 lg:h-5"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 py-1">
              <FaMapMarkerAlt className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="text-sm lg:text-sm">{booking.location}</span>
            </div>
            {/* <div className="flex flex-wrap items-center gap-2 py-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 rounded py-1 px-3">
                <FaClock className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-sm lg:text-sm">{booking.pickupTime}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 rounded py-1 px-3">
                <FaRoad className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="text-sm lg:text-sm">
                  الكيلومترات المتاحة {booking.kilometers}
                </span>
              </div>
            </div> */}
          </div>
        </div>

        {/* تفاصيل الحجز */}
        <div
          className={cn(
            "space-y-4 pt-2 bg-[#D2D6DB3D] p-3 rounded-xl",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          <h3 className="text-base font-bold text-[#191C1F]">تاريخ الحجز</h3>

          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#4F5352]">مدة الحجز</p>
              <p className="text-sm font-bold text-primary">{rentalDays} يوم</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#4F5352]">تاريخ الاستلام</p>
              <p className="text-sm font-bold text-primary">{pickupDate}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#4F5352]">تاريخ الإرجاع</p>
              <p className="text-sm font-bold text-primary">{returnDate}</p>
            </div>
          </div>
          <p className="italic text-sm text-[#4F5352]">
            يتوجب على المستأجر إعادة السيارة أو طلب تمديد الحجز لتجنب فرض أي
            رسوم إضافية
          </p>
        </div>

        {/* طريقة الاستلام */}
        <div
          className={cn(
            "space-y-2 pt-4 border-t border-gray-100",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <h3 className="text-base font-bold text-[#191C1F]">طريقة الاستلام</h3>
          <div className="flex items-start gap-3 bg-[#D2D6DB3D] p-3 rounded-xl">
            <FaMapMarkerAlt className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">{deliveryMethod}</p>
              <p className="text-sm text-gray-500">{deliveryNote}</p>
            </div>
          </div>
        </div>

        {/* تفاصيل الدفع */}
        <div
          className={cn(
            "space-y-3 pt-4 border-t border-gray-100",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "250ms" }}
        >
          <h3 className="text-base font-bold text-[#191C1F]">تفاصيل الدفع</h3>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                اجمالي سعر الايجار لمدة {rentalDays} ايام
              </span>
              <div className="flex items-center gap-1">
                <span className="text-sm lg:text-base text-[#717182] font-bold">
                  {subtotal}
                </span>
                <Image
                  src="/images/SAR.png"
                  alt="sar"
                  width={30}
                  height={30}
                  className="w-4 h-4 lg:w-5 lg:h-5"
                />
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">الضريبة</span>
              <div className="flex items-center gap-1">
                <span className="text-sm lg:text-base text-[#717182] font-bold">
                  {tax}
                </span>
                <Image
                  src="/images/SAR.png"
                  alt="sar"
                  width={30}
                  height={30}
                  className="w-4 h-4 lg:w-5 lg:h-5"
                />
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
              <span>الإجمالي</span>
              <div className="flex items-center gap-1">
                <span className="text-sm lg:text-xl font-bold text-primary">
                  {total}
                </span>
                <Image
                  src="/images/SAR.png"
                  alt="sar"
                  width={30}
                  height={30}
                  className="w-4 h-4 lg:w-5 lg:h-5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "300ms" }}
        >
          <button
            onClick={handleRenew}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#012738] text-white rounded-xl hover:bg-[#012738]/90 transition-all hover:scale-[1.02]"
          >
            <FaRotateRight className="h-4 w-4" />
            <span className="font-medium">تمديد الحجز</span>
          </button>
          <button
            onClick={handleRefund}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#012738] border-2 border-[#012738] rounded-xl hover:bg-[#012738]/5 transition-all hover:scale-[1.02]"
          >
            <FaCreditCard className="h-4 w-4" />
            <span className="font-medium">إعادة الدفع</span>
          </button>
        </div>

        {/* Payment Popup */}
        <PaymentPopup
          isOpen={showPaymentPopup}
          onClose={() => setShowPaymentPopup(false)}
          onSelect={handlePaymentSelect}
          selectedMethod={selectedPaymentMethod}
        />
      </div>
    </div>
  );
}