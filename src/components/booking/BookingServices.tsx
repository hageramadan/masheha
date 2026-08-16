'use client';

import { AdditionalService } from '@/src/types/booking';
import { FaCheck } from 'react-icons/fa';

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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">الخدمات الإضافية</h2>
      
      <div className="space-y-3">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onToggle(service.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/30'
              }`}
            >
              <div className="text-right">
                <p className="font-bold text-gray-800">{service.name}</p>
                {service.description && (
                  <p className="text-sm text-gray-500">{service.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-primary">{service.price} ريال</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
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
    </div>
  );
}