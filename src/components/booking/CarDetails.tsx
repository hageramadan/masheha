"use client";

import Image from "next/image";
import { MdOutlineAccessTime } from "react-icons/md";
import { TbWheel } from "react-icons/tb";
import { RxLayers } from "react-icons/rx";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineSensorDoor } from "react-icons/md";

interface CarDetailsProps {
  car: {
    id: number;
    name: string;
    brand: string;
    year: string;
    pricePerDay: number;
    pricePerMonth?: number;
    image: string;
    image_url?: string;
    guarantees?: { title: string }[];
    cancellationPolicies?: { description: string }[];
    seats?: number;
    doors?: number;
    transmission?: string;
    fuelType?: string;
  };
  rentalType?: "يومي" | "شهري";
}

export default function CarDetails({
  car,
  rentalType = "يومي",
}: CarDetailsProps) {
  const imageSrc = car.image || car.image_url || "";

  const isMonthly = rentalType === "شهري";
  const price = isMonthly
    ? car.pricePerMonth || car.pricePerDay
    : car.pricePerDay;
  const period = isMonthly ? "الشهر" : "اليوم";

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 md:p-4">
        {/* عمود الصورة - مساحة اكبر */}
        <div className="md:col-span-1">
          <div className="relative h-[130px] md:h-[100px] lg:h-[110px] overflow-hidden rounded-lg">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={car.name}
                fill
                className="object-contain object-center p-1"
                priority
                onError={(e) => {
                  console.error("❌ Image failed to load:", imageSrc);
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm">لا توجد صورة</span>
              </div>
            )}
          </div>
        </div>
   {/* #4b398e */}
        {/* عمود المعلومات - في النص */}
        <div className="md:col-span-2 space-y-1 w-full mx-auto flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm lg:text-base font-bold text-gray-600 ms-1">
                {car.year}
              </span>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 line-clamp-1">
                {car.name}
              </h2>
            </div>
            <div className="col-span-1 md:hidden">
              <div className="flex items-center gap-1 lg:gap-2 justify-end">
                <p className="text-xl md:text-2xl font-bold text-primary">
                  {price}
                </p>
                <p className="text-xs text-[#4F5352] font-extrabold">
                  ريال / {period}
                </p>
              </div>
            </div>
          </div>
          
          {/* <p className="text-sm text-[#717182]">أقل مدة للتأجير مع خدمة التوصيل (2 أيام)</p> */}
        </div>

        {/* عمود السعر - في النص */}
        <div className="hidden md:flex md:col-span-1 items-center justify-end">
          <div className="flex items-center gap-1 lg:gap-2">
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {price}
            </p>
            <p className="text-sm text-[#4F5352] font-extrabold">
              ريال / {period}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}