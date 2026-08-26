"use client";
import { FaStar } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";
import { TbClockHour3 } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";
import Image from "next/image";
import { TbBrandSupabase } from "react-icons/tb";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaRegSmileBeam } from "react-icons/fa";

interface StatsProps {
  providerName?: string;
  providerImage?: string;
  city?: string;
  district?: string;
  averageRating?: number;
  countReviews?: number;
  acceptanceRate?: number;
  customerSatisfactionRate?: number;
  deliverySpeedRate?: number;
  isVerified?: boolean;
  features?: {
    icon: React.ReactNode;
    title: string;
  }[];
}

export default function Stats({
  providerName = "فئة الحليف",
  providerImage = "/images/is.png",
  city = "المدينة",
  district = "الحي",
  averageRating = 4.5,
  countReviews = 0,
  acceptanceRate = 94,
  customerSatisfactionRate = 94,
  deliverySpeedRate = 98,
  features = [
    { icon: <LuShieldCheck className="text-sm" />, title: "بدون تأمين مسترد" },
    { icon: <CiDeliveryTruck className="text-sm" />, title: "توصيل مجاني" },
    {
      icon: <TbClockHour3 className="text-sm" />,
      title: "تأخير مجاني عند الإرجاع",
    },
  ],
}: StatsProps) {
  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto px-1 lg:px-4">
        <div className="grid grid-cols-5 lg:grid-cols-4 gap-1 lg:gap-6 mb-4">
          <div className="flex col-span-2 lg:col-span-1">
            <Image
              src={providerImage}
              width={155}
              height={155}
              alt={providerName}
              className="object-cover w-14 h-14 lg:w-20 lg:h-20"
            />
            <div className="flex flex-col gap-0 lg:gap-1">
              <div className="flex items-center flex-wrap">
                <div className="text-sm lg:text-xl font-bold text-primary">
                  {providerName}
                </div>
                {/* {isVerified && (
                  <div className="hidden lg:flex items-center justify-center gap-1 px-1 lg:px-2 bg-[#34C75929] text-[#34C759] py-1 lg:py-2 w-fit rounded-sm">
                    <IoIosCheckmarkCircleOutline />
                    <p className="font-semibold text-xs lg:text-sm">موثق</p>
                  </div>
                )} */}
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                <p className="text-[6px] md:text-[12px] text-gray-600 mt-1">
                  {city} - {district} 
                  
                </p>
                <span className="text-sm lg:text-lg text-gray-600">|</span>
                <div className="flex items-center gap-0.5 lg:gap-1">
                  <FaStar className="text-orange-300 text-[10px] lg:text-2xl" />
                <span className="text-[10px] lg:text-sm">{averageRating}</span>
                {countReviews > 0 && (
                  <span className="text-[8px] lg:text-xs text-gray-400">
                    ({countReviews} تقييم)
                  </span>
                )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 lg:gap-1">
            <div className="flex flex-col lg:flex-row justify-center items-center">
              <TbBrandSupabase className="text-lg lg:text-3xl text-orange-300" />
              <div className="flex flex-col justify-center items-center">
                <div className="text-xs lg:text-sm font-bold text-[#212121]">
                  {deliverySpeedRate}%
                </div>
                <p className="text-[7px] md:text-sm text-center lg:text-start text-primary font-bold mt-1">
                  سرعة التوصيل
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 lg:gap-1 items-center">
            <div className="flex flex-col lg:flex-row justify-center items-center">
              <IoShieldCheckmarkOutline className="text-lg lg:text-2xl font-bold text-[#34C759]" />
              <div className="flex flex-col justify-center items-center">
                <div className="text-xs lg:text-sm font-bold text-[#212121]">
                  {acceptanceRate}%
                </div>
                <p className="text-[7px] md:text-sm text-center lg:text-start text-primary font-bold mt-1">
                  معدل قبول الحجوزات
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 lg:gap-1 items-center">
            <div className="flex flex-col lg:flex-row justify-center items-center">
              <FaRegSmileBeam className="text-lg lg:text-2xl text-[#34C759]" />
              <div className="flex flex-col justify-center items-center">
                <div className="text-xs lg:text-sm font-bold text-[#212121]">
                  {customerSatisfactionRate}%
                </div>
                <p className="text-[7px] md:text-sm text-center lg:text-start text-primary font-bold mt-1">
                  رضاء العملاء
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 lg:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-1 lg:gap-3 p-1 lg:p-4 bg-[#0127380A] rounded-[8px] hover:bg-gray-200 transition-colors"
            >
              <div className="">{feature.icon}</div>
              <div>
                <p className="font-bold text-gray-800 text-[8px] md:text-base">
                  {feature.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
