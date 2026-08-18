"use client";

import Image from "next/image";
import { Car } from "@/src/types/booking";
import { GoDotFill } from "react-icons/go";
interface CarDetailsProps {
  car: Car;
}

export default function CarDetails({ car }: CarDetailsProps) {
  // ✅ استخدام البيانات من car.terms.advantages
  const advantages = car.terms?.advantages || [];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* ✅ 6 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 md:p-6">
        {/* ✅ العمود الأول - صورة السيارة */}
        <div className="md:col-span-1">
          <div className="relative h-48 md:h-56 lg:h-64  overflow-hidden">
            <Image
              src={car.image}
              alt={car.name}
              fill
              className="object-contain p-3"
              priority
            />
          </div>
        </div>

        {/* ✅ العمود الثاني والثالث - السعر والمميزات + المزايا */}
        <div className="md:col-span-4 space-y-3">
         <div className="flex items-center justify-between">
             {/* اسم السيارة */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-1">
            {car.name}{" "}
            <span className="text-sm lg:text-base font-bold text-[#A7A7A7] me-1">
              {car.year}
            </span>
          </h2>
           <div className="col-span-1 md:hidden ">
          <div className="flex items-center gap-1 lg:gap-2 justify-end">
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {car.pricePerDay}
            </p>
            <p className="text-sm lg:text-base text-[#4F5352] font-extrabold">
              ريال / اليوم
            </p>
          </div>
        </div>
         </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            <div className="md:col-span-2 space-y-3">
            {/* ✅ مزايا التأجير - من البيانات */}
            {advantages.length > 0 && (
              <div className="">
                <p className="text-sm lg:text-base font-bold text-gray-700 mb-2">
                  مزايا التأجير
                </p>
                <div className="flex flex-wrap items-center gap-0">
                  {advantages.map((advantage, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1.5 text-sm lg:text-base text-gray-600  px-2.5 py-1 rounded-full"
                    >
                      <GoDotFill className="text-[#717182] text-[10px]" />
                      {advantage}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ✅ العمود الرابع والخامس - الشروط */}
          <div className="md:col-span-2 space-y-2">
            <p className="text-sm lg:text-base font-bold text-gray-700 mb-1">شروط التأجير</p>
            <div className="space-y-1.5">
              {car.terms?.conditions?.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm lg:text-base text-gray-600"
                >
                  <GoDotFill className="text-[#717182] text-[10px] shrink-0" />
                  <span className="line-clamp-1">{condition}</span>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>

        {/* ✅ العمود السادس - السعر الإجمالي */}
        <div className="hidden md:block md:col-span-1  ">
          <div className="hidde md:flex items-center gap-1 lg:gap-2 justify-end">
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {car.pricePerDay}
            </p>
            <p className="text-sm lg:text-base text-[#4F5352] font-extrabold">
              ريال / اليوم
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
