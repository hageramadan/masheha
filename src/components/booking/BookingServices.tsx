'use client';

import { AdditionalService } from '@/src/types/booking';
import { FaCheck } from 'react-icons/fa';
import { useEffect } from 'react';

interface BookingServicesProps {
  services: AdditionalService[];
  selectedServices: string[];
  onToggle: (id: string) => void;
}

export default function BookingServices({
  services,
  selectedServices,
  onToggle,
}: BookingServicesProps) {
  if (services.length === 0) return null;

  // التأكد من أن أول خدمة محددة دائمًا
  useEffect(() => {
    if (services.length > 0) {
      const firstServiceId = services[0].id;
      // لو الخدمة الأولى مش في المحددين، نضيفها
      if (!selectedServices.includes(firstServiceId)) {
        onToggle(firstServiceId);
      }
    }
  }, [services, selectedServices, onToggle]);

  const handleToggle = (id: string) => {
    // ❌ منع إلغاء تحديد أول خدمة
    if (id === services[0]?.id) {
      // لو كانت أول خدمة و محاولة إلغائها → نمنعها
      if (selectedServices.includes(id)) {
        return; // ممنوع الإلغاء
      }
      // لو مش محددة → نحددها (عادي)
      onToggle(id);
      return;
    }
    // باقي الخدمات عادي
    onToggle(id);
  };

  return (
    <div className="bg-white rounded-2xl border p-3 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base lg:text-lg font-bold text-gray-800">الخدمات الإضافية</h2>
      </div>

      <div className="space-y-3">
        {services.map((service, index) => {
          const isSelected = selectedServices.includes(service.id);
          const isFirst = index === 0;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => handleToggle(service.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/30'
              } ${isFirst ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="text-right flex flex-col gap-2">
                <p className="text-sm lg:text-base text-[#4F5352]">
                  {service.name}
                  
                </p>
                <span className="text-sm lg:text-base font-bold text-primary">
                  {service.price} ريال
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && <FaCheck className="text-xs" />}
                </div>
              
              </div>
            </button>
          );
        })}
      </div>

      
    </div>
  );
}