"use client";
import {
  FaStar,
 
} from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";
import { TbClockHour3 } from "react-icons/tb";
import { LuShieldCheck } from "react-icons/lu";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import Image from "next/image";
import { TbBrandSupabase } from "react-icons/tb";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaRegSmileBeam } from "react-icons/fa";

export default function Stats() {
  return (
    <section className="py-2 md:py-4 bg-white">
      <div className="container mx-auto px-4">
        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-2 md:mb-4">
          <div className="flex col-span-2 lg:col-span-1  ">
            <Image src="/images/is.png" width={155} height={155} alt="brand" className="w-16 lg:w-20 h-16 lg:h-20"/>
          
          <div className="flex flex-col gap-1">
             <div className="flex items-center flex-wrap">
             <div className="text-lg md:text-xl font-bold text-primary">
              فئة الحليف
            </div>
            <div className="flex items-center justify-center gap-1 px-2 bg-[#34C75929] text-[#34C759] py-2 w-fit rounded-sm">
                <IoIosCheckmarkCircleOutline/>
            <p className="font-semibold text-sm">موثق</p>

            </div>
           </div>
            <div className="flex items-center gap-2">
              <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-1">
                المدينة - الحي |
              </p>

              <FaStar className="text-orange-300" />
              <span>4.5</span>
            </div>
          </div>
          </div>
          <div className="flex items-center gap-1">
            <TbBrandSupabase className="text-3xl text-orange-300"/>
            <div className="flex flex-col justify-center items-center">
                <div className="text-sm font-bold text-[#212121]">
              94%
            </div>
            <p className="text-xs md:text-sm  text-primary font-bold mt-1">
              سرعة التوصيل
            </p>
            </div>
          </div>

         <div className="flex items-center gap-1">
            <IoShieldCheckmarkOutline className="text-2xl font-bold text-[#34C759]"/>
            <div className="flex flex-col justify-center items-center">
                <div className="text-sm font-bold text-[#212121]">
              94%
            </div>
            <p className="text-xs md:text-sm  text-primary font-bold mt-1">
               معدل قبول الحجوزات
            </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <FaRegSmileBeam className="text-2xl text-[#34C759]"/>
            <div className="flex flex-col justify-center items-center">
                <div className="text-sm font-bold text-[#212121]">
              98%
            </div>
            <p className="text-xs md:text-sm  text-primary font-bold mt-1">
               رضاء العملاء
            </p>
            </div>
          </div>
        </div>

        {/* المميزات */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-4">
          {/* بدون تأمين مسترد */}
          <div className="flex items-center gap-1 lg:gap-3  p-1 lg:p-4  bg-[#0127380A] rounded-[8px] hover:bg-gray-200">
            <div>
              <LuShieldCheck className="text-xl" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-xs md:text-base">
                بدون تأمين مسترد
              </p>
            </div>
          </div>
          {/* توصيل مجاني */}
          <div className="flex items-center gap-1 lg:gap-3  p-1 lg:p-4  bg-[#0127380A] rounded-[8px] hover:bg-gray-200">
            <div>
              <CiDeliveryTruck className=" text-xl" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-xs md:text-base">
                توصيل مجاني
              </p>
            </div>
          </div>
          {/* تأخير مجاني */}
          <div className="flex items-center gap-1 lg:gap-3  p-1 lg:p-4  bg-[#0127380A] rounded-[8px] hover:bg-gray-200">
            <div>
              <TbClockHour3 className=" text-xl" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-xs md:text-base">
                تأخير مجاني عند الإرجاع
              </p>
            </div>
          </div>
        </div>

      
      </div>
    </section>
  );
}
