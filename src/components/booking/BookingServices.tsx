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

 
  useEffect(() => {
    if (services.length > 0 && selectedServices.length === 0) {
   
      onToggle(services[0].id);
    }
  }, [services, selectedServices, onToggle]);

  return (
    <div className="bg-white rounded-2xl border p-3 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base lg:text-lg font-bold text-gray-800">الخدمات الإضافية</h2>
        
      </div>
      
      <div className="space-y-3">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onToggle(service.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/30'
              }`}
            >
              <div className="text-right flex flex-col gap-2">
                <p className="text-sm lg:text-base text-[#4F5352]">{service.name}</p>
                <span className="text-sm lg:text-base font-bold text-primary">{service.price} ريال</span>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5  rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300'
                }`}>
                  {isSelected && <FaCheck className="text-xs" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ✅ رسالة إرشادية */}
      {selectedServices.length === 0 && (
        <p className="text-xs text-red-500 text-center mt-2">
           يرجى اختيار خدمة إضافية واحدة على الأقل
        </p>
      )}
    </div>
  );
}