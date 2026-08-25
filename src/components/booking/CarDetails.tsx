"use client";

import Image from "next/image";
import { MdOutlineAccessTime } from "react-icons/md";
import { TbWheel } from "react-icons/tb";
import { RxLayers } from "react-icons/rx";
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
  // const advantages = car.guarantees?.map((g) => g.title) || [];

  // const conditions = car.cancellationPolicies?.map((c) => c.description) || [];

  const imageSrc = car.image || car.image_url || "";

  const isMonthly = rentalType === "شهري";
  const price = isMonthly
    ? car.pricePerMonth || car.pricePerDay
    : car.pricePerDay;
  const period = isMonthly ? "الشهر" : "اليوم";

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-6">
        <div className="md:col-span-1">
          <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden ">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={car.name}
                fill
                className="object-contain p-3"
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
           
        <div className="md:col-span-2 space-y-3  w-full md:w-[80%] mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-1">
              {car.name}
              <span className="text-sm lg:text-base font-bold text-gray-600 ms-1">
                {car.year}
              </span>
            </h2>
            <div className="col-span-1 md:hidden">
              <div className="flex items-center gap-1 lg:gap-2 justify-end">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {price}
                </p>
                <p className="text-sm  text-[#4F5352] font-extrabold">
                  ريال / {period}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
          
            {/* <div className="md:col-span-2 space-y-3">
              {advantages.length > 0 && (
                <div>
                  <p className="text-sm lg:text-base font-bold text-gray-700 mb-2">
                    مزايا التأجير
                  </p>
                  <div className="flex flex-col items-start gap-0">
                    {advantages.map((advantage, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1.5 text-sm lg:text-base text-gray-600 px-2.5 py-1 rounded-full"
                      >
                        <GoDotFill className="text-[#717182] text-[10px]" />
                        {advantage}
                      </span>
                    ))}
                    <p className="text-gray-700 text-[14px]">{car.doors} ابواب</p>
                    <p className="text-gray-700 text-[14px]">{car.seats} مقاعد</p>
                  </div>
                </div>
              )}
            </div> */}

            
            <div className="md:col-span-2 space-y-2">
              <p className="text-sm lg:text-base font-bold text-gray-700 my-2">
                شروط التأجير
              </p>
              <div className="space-y-1.5">
                {/* {conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm lg:text-base text-gray-600"
                  >
                    <GoDotFill className="text-[#717182] text-[10px] shrink-0" />
                    <span className="line-clamp-1">{condition}</span>
                  </div>
                ))} */}
                <ul className="list-disc px-4 md:list-outside space-y-2 text-gray-600 text-[15px]">
                  <li>الحد الأدنى للعمر: العمر 25 سنة وأكثر</li>
                  <li>
                    رخصة القيادة: رخصة قيادة سارية المفعول - مع هوية أو اقامة
                    سارية المفعول
                  </li>
                  <li>
                    نطاق توصيل السيارة: توصيل السيارات لموقعك داخل مدينة الرياض
                    فقط
                  </li>
                  <li>
                    التأمين المسترد: التأجير اليومي يشترط دفع مبلغ من 500 إلى
                    1000 ريال ويسترجع عند اعادة السيارة (لا ينطبق هذا الشرط على
                    العملاء السابقين وعملاء التأجير الشهري)
                  </li>
                </ul>
                <div className="border-t border-gray-200 flex items-center flex-wrap pt-2 gap-2 my-3">
                  <div className="flex gap-1 items-center text-gray-700">
                    <MdOutlineAccessTime className="text-lg"/>
                    <p className=" text-sm">توصيل السيارة في الرياض</p>
                  </div>
                  <div className="flex gap-1 items-center text-gray-700 border-s ps-3">
                    <TbWheel className="text-lg"/>
                     <p className=" text-sm">٢٠٠ كم/اليوم</p>
                  </div>
                  <div className="flex gap-1 items-center text-gray-700 md:border-s md:ps-3">
                    <RxLayers className="text-lg"/>
                     <p className=" text-sm">المساعدة على الطريق</p>
                  </div>
                 
                 
                </div>
              </div>
            </div>
          </div>
        </div>

      
        <div className="hidden md:block md:col-span-1">
          <div className="flex items-center gap-1 lg:gap-2 justify-end">
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {price}
            </p>
            <p className="text-sm  text-[#4F5352] font-extrabold">
              ريال / {period}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
