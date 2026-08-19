"use client";
import { FaStar } from "react-icons/fa";
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
      <div className="container mx-auto px-2 lg:px-4">
        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-6 md:grid-cols-6 gap-1 lg:gap-6 mb-2 md:mb-4">
          <div className="flex col-span-3">
            <Image
              src="/images/is.png"
              width={155}
              height={155}
              alt="brand"
              className="object-cover w-14  h-14 lg:w-20 lg:h-20"
            />

            <div className="flex flex-col gap-0 lg:gap-1">
              <div className="flex items-center flex-wrap">
                <div className="text-[10px] lg:text-xl font-bold text-primary">
                  فئة الحليف
                </div>
                <div className="hidden lg:flex items-center justify-center gap-1 px-1 lg:px-2 bg-[#34C75929] text-[#34C759] py-1 lg:py-2 w-fit rounded-sm">
                  <IoIosCheckmarkCircleOutline />
                  <p className="font-semibold text-xs lg:text-sm">موثق</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[7px] md:text-sm text-gray-600 mt-1 line-clamp-1">
                  المدينة - الحي |
                </p>

                <FaStar className="text-orange-300 text-xs lg:text-2xl" />
                <span className="text-[10px] lg:text-sm">4.5</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-0 lg:gap-1 ">
            <div className="flex flex-col lg:flex-row justify-center items-center">
              <TbBrandSupabase className="text-lg lg:text-3xl text-orange-300" />
              <div className="flex flex-col justify-center items-center">
                <div className="text-xs lg:text-sm font-bold text-[#212121]">
                  94%
                </div>
                <p className="text-[7px] md:text-sm  text-center lg:text-start text-primary font-bold mt-1">
                  سرعة التوصيل
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1  gap-0 lg:gap-1 items-center">
            <div className="flex flex-col lg:flex-row justify-center items-center">
              <IoShieldCheckmarkOutline className="text-lg lg:text-2xl font-bold text-[#34C759]" />
              <div className="flex flex-col justify-center items-center">
                <div className="text-xs lg:text-sm font-bold text-[#212121]">
                  94%
                </div>
                <p className="text-[7px] md:text-sm text-center lg:text-start  text-primary font-bold mt-1">
                  معدل قبول الحجوزات
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1  gap-0 lg:gap-1 items-center">
            <div className="flex flex-col lg:flex-row justify-center items-center">
              <FaRegSmileBeam className="text-lg lg:text-2xl text-[#34C759]" />
              <div className="flex flex-col justify-center items-center">
                <div className="text-xs lg:text-sm font-bold text-[#212121]">
                  98%
                </div>
                <p className="text-[7px] md:text-sm text-center lg:text-start  text-primary font-bold mt-1">
                  رضاء العملاء
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* المميزات */}
        <div className="grid grid-cols-3 gap-1 lg:gap-4">
          {/* بدون تأمين مسترد */}
          <div className="flex items-center gap-1 lg:gap-3  p-1 lg:p-4  bg-[#0127380A] rounded-[8px] hover:bg-gray-200">
            <div>
              <LuShieldCheck className="text-xl" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-[8px] md:text-base">
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
              <p className="font-bold text-gray-800 text-[8px] md:text-base">
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
              <p className="font-bold text-gray-800 text-[8px] md:text-base">
                تأخير مجاني عند الإرجاع
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
