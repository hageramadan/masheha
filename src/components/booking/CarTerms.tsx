'use client';

import { RentalTerms } from '@/src/types/booking';
import { FaCheckCircle, FaShieldAlt, FaTools, FaCar, FaMapMarkerAlt, FaWallet } from 'react-icons/fa';

interface CarTermsProps {
  terms: RentalTerms;
}

export default function CarTerms({ terms }: CarTermsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        
        {/* شروط التأجير */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaShieldAlt className="text-primary" />
            شروط التأجير
          </h3>
          <ul className="space-y-2.5">
            {terms.conditions.map((condition, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                <FaCheckCircle className="text-green-500 text-sm mt-0.5 shrink-0" />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* مزايا التأجير */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaTools className="text-primary" />
            مزايا التأجير
          </h3>
          <ul className="space-y-2.5">
            {terms.advantages.map((advantage, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-600">
                <FaCheckCircle className="text-primary text-sm mt-0.5 shrink-0" />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ملخص سريع */}
      <div className="border-t border-gray-100 px-6 py-3 bg-gray-50/50">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <FaCar className="text-primary" />
            <span>موديل 2023</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary" />
            <span>التوصيل مجانا بنفس اليوم</span>
          </div>
          <div className="flex items-center gap-2">
            <FaWallet className="text-primary" />
            <span>مبلغ مسترد 1000 ريال</span>
          </div>
        </div>
      </div>
    </div>
  );
}