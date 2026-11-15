'use client';

import Image from 'next/image';
import { FaLocationDot } from 'react-icons/fa6';

interface BookingPickupLocationProps {
  selectedAddress: string;
  onOpenMap: () => void;
}

export default function BookingPickupLocation({
  selectedAddress,
  onOpenMap,
}: BookingPickupLocationProps) {
  return (
    <div className="bg-[#FCF9F466] border rounded-lg p-3 lg:p-5 space-y-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm lg:text-base font-semibold text-gray-800">
          موقع الاستلام *
        </h2>
        <Image
          onClick={onOpenMap}
          src="/images/map.png"
          alt="map"
          className=" cursor-pointer w-full h-13.5 object-cover rounded-lg mb-2 lg:mb-3"
          width={600}
          height={300}
        />
        <button
          type="button"
          onClick={onOpenMap}
          className="flex items-center gap-2 px-4 py-3 justify-center text-sm lg:text-lg font-medium bg-primary text-white border border-primary/30 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <FaLocationDot className="text-lg" />
          حدد الموقع على الخريطة
        </button>
      </div>

      {selectedAddress ? (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg flex items-center gap-2">
          <FaLocationDot className="h-3 w-3 text-primary shrink-0" />
          <span className="font-medium">الموقع المحدد:</span>
          <span className="break-all">{selectedAddress}</span>
        </div>
      ) : (
        <p className="text-xs text-red-500 text-center">
          ⚠️ يرجى تحديد موقع الاستلام على الخريطة
        </p>
      )}
    </div>

  );
}
