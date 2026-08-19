// src/components/profile/BookingsList.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock, FaRoad, FaArrowLeft } from 'react-icons/fa';
import { cn } from '@/src/lib/utils';
import BookingDetails from './BookingDetails';

// بيانات تجريبية للحجوزات
const mockBookings = [
  {
    id: 1,
    date: 'October 17, 2023',
    price: 115,
    type: 'سيدان / يوم',
    location: 'يتم توصيل في (الرياض فقط)',
    kilometers: 400,
    pickupTime: 'استلام خلال ساعة',
    status: 'current',
    carImage: '/images/cars/car1.png',
    carName: 'تويوتا كامري 2023',
    pickupLocation: 'الرياض - حي العليا',
    dropoffLocation: 'الرياض - حي الملقا',
    bookingNumber: 'BK-2024-001',
  },
  {
    id: 2,
    date: 'October 17, 2023',
    price: 115,
    type: 'سيدان / يوم',
    location: 'يتم توصيل في (الرياض فقط)',
    kilometers: 400,
    pickupTime: 'استلام خلال ساعة',
    status: 'current',
    carImage: '/images/cars/car2.png',
    carName: 'هونداي النترا 2023',
    pickupLocation: 'الرياض - حي النخيل',
    dropoffLocation: 'الرياض - حي العليا',
    bookingNumber: 'BK-2024-002',
  },
  {
    id: 3,
    date: 'October 17, 2023',
    price: 115,
    type: 'سيدان / يوم',
    location: 'يتم توصيل في (الرياض فقط)',
    kilometers: 400,
    pickupTime: 'استلام خلال ساعة',
    status: 'completed',
    carImage: '/images/cars/c4.jpg',
    carName: 'نيسان سنترا 2023',
    pickupLocation: 'الرياض - حي الورود',
    dropoffLocation: 'الرياض - حي النخيل',
    bookingNumber: 'BK-2024-003',
  },
];

export default function BookingsList() {
  const [filter, setFilter] = useState<'current' | 'completed'>('current');
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // أنيميشن عند تغيير الفلتر
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [filter]);

  // أنيميشن عند تحميل المكون
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredBookings = mockBookings.filter((booking) => {
    return booking.status === filter;
  });

  // العودة إلى قائمة الحجوزات
  const handleBack = () => {
    setSelectedBooking(null);
  };

  // إذا تم اختيار حجز، عرض تفاصيله
  if (selectedBooking) {
    return <BookingDetails booking={selectedBooking} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6 bg-white min-h-screen">
      {/* أزرار الفلتر */}
      <div className="flex gap-2 w-full">
        <button
          type="button"
          onClick={() => setFilter('current')}
          className={cn(
            "flex-1 py-3 px-4 border-b text-sm font-medium transition-all duration-200",
            filter === 'current'
              ? "border-[#012738]"
              : "text-gray-600 hover:text-gray-800"
          )}
        >
          <h1 className='text-sm lg:text-sm'>الحالية</h1>
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={cn(
            "flex-1 py-3 border-b px-4 text-sm font-medium transition-all duration-200",
            filter === 'completed'
              ? "border-[#012738]"
              : "text-gray-600 hover:text-gray-800"
          )}
        >
          <h2 className='text-sm lg:text-sm'>المنتهية</h2>
        </button>
      </div>

      {/* قائمة الحجوزات مع أنيميشن الظهور من الأسفل */}
      <div className="space-y-4">
        {filteredBookings.map((booking, index) => (
          <div
            key={booking.id}
            onClick={() => setSelectedBooking(booking)}
            className={cn(
              "bg-white rounded-2xl shadow-md border p-4 hover:shadow-lg hover:border-primary/45 transition-all cursor-pointer",
              "transform transition-all duration-500 ease-out",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <div className="flex gap-4">
              {/* صورة السيارة */}
              <div className="w-28 h-24 shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={booking.carImage}
                  alt="Car"
                  width={112}
                  height={96}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* معلومات الحجز */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 text-base lg:text-lg">{booking.type}</p>
                  <div className='flex items-center gap-1'>
                    <span className="text-sm lg:text-xl font-bold text-primary">
                      {booking.price}
                    </span>
                    <Image src="/images/SAR.png" alt='sar' width={30} height={30} className='w-4 h-4 lg:w-5 lg:h-5'/>
                  </div>
                </div>
                <p className="text-base text-gray-500 py-1">{booking.date}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 py-1">
                  <FaMapMarkerAlt className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className='text-sm lg:text-sm'>{booking.location}</span>
                </div>
                {/* <div className='flex flex-wrap items-center gap-2 py-1'>
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 rounded py-1 px-3">
                    <FaClock className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className='text-sm lg:text-sm'>{booking.pickupTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 rounded py-1 px-3">
                    <FaRoad className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className='text-sm lg:text-sm'>الكيلومترات المتاحة {booking.kilometers}</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className={cn(
            "text-center py-12 text-gray-500 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            لا توجد {filter === 'current' ? 'حجوزات حالية' : 'حجوزات منتهية'}
          </div>
        )}
      </div>
    </div>
  );
}