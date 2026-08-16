"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // ✅ شيلنا Pagination و Navigation
import { Card, CardContent } from "@/src/ui/card";
import { Button } from "@/src/ui/button";
import { FaCar, FaCalendarDay, FaCalendarAlt } from "react-icons/fa";
import { toast } from "sonner";
import Stats from "./Stats";
// استيراد أنماط Swiper (شيلنا pagination و navigation)
import "swiper/css";
import Image from "next/image";

// بيانات السيارات مع نوع التأجير
const cars = [
  // سيارات التأجير اليومي
  {
    id: 1,
    name: "MG ZS",
    year: "2023",
    price: "110",
    currency: "ر.س",
    period: "يومياً",
    type: "daily",
    image: "/images/cars/car1.png",
    specs: "1953 ",
  },
  {
    id: 2,
    name: "تويوتا كامري",
    year: "2024",
    price: "250",
    currency: "ر.س",
    period: "يومياً",
    type: "daily",
    image: "/images/cars/car1.png",
    specs: "2490 ",
  },
  {
    id: 3,
    name: "هوندا أكورد",
    year: "2024",
    price: "280",
    currency: "ر.س",
    period: "يومياً",
    type: "daily",
    image: "/images/cars/car1.png",
    specs: "2350 ",
  },
  {
    id: 4,
    name: "نيسان باترول",
    year: "2023",
    price: "350",
    currency: "ر.س",
    period: "يومياً",
    type: "daily",
    image: "/images/cars/car1.png",
    specs: "5600 ",
  },
  {
    id: 5,
    name: "تويوتا هايلوكس",
    year: "2024",
    price: "300",
    currency: "ر.س",
    period: "يومياً",
    type: "daily",
    image: "/images/cars/car1.png",
    specs: "2750 ",
  },

  // سيارات التأجير الشهري
  {
    id: 6,
    name: "مرسيدس E-Class",
    year: "2023",
    price: "4500",
    currency: "ر.س",
    period: "شهرياً",
    type: "monthly",
    image: "/images/cars/car1.png",
    specs: "2990 ",
  },
  {
    id: 7,
    name: "بي إم دبليو X5",
    year: "2024",
    price: "5000",
    currency: "ر.س",
    period: "شهرياً",
    type: "monthly",
    image: "/images/cars/car1.png",
    specs: "3000 ",
  },
  {
    id: 8,
    name: "أودي Q7",
    year: "2024",
    price: "4800",
    currency: "ر.س",
    period: "شهرياً",
    type: "monthly",
    image: "/images/cars/car1.png",
    specs: "2960 ",
  },
  {
    id: 9,
    name: "فولفو XC90",
    year: "2023",
    price: "4200",
    currency: "ر.س",
    period: "شهرياً",
    type: "monthly",
    image: "/images/cars/car1.png",
    specs: "2750 ",
  },
  {
    id: 10,
    name: "لكزس LX",
    year: "2024",
    price: "5500",
    currency: "ر.س",
    period: "شهرياً",
    type: "monthly",
    image: "/images/cars/car1.png",
    specs: "3500 ",
  },
];

export default function FeaturedCars() {
  const [activeTab, setActiveTab] = useState("daily"); // 'daily' | 'monthly'

  // تصفية السيارات حسب النوع
  const filteredCars = cars.filter((car) => car.type === activeTab);

  // معالجة التأجير
  const handleRent = (carName) => {
    toast.success(`🚗 تم تأجير ${carName} بنجاح!`, {
      description: "سنتواصل معك خلال ٢٤ ساعة لتأكيد التأجير",
      duration: 5000,
    });
  };

  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <h2 className="text-2xl md:text-4xl font-bold  mb-4 text-primary">
          احجز الان 
        </h2>
        

        {/* أزرار التبديل */}
        <div className="flex justify-center gap-4 mb-10">
          <Button
            onClick={() => setActiveTab("daily")}
            className={`px-8 py-6 text-lg rounded-full transition-all duration-300 ${
              activeTab === "daily"
                ? "bg-primary text-white shadow-lg shadow-primary/30 hover:"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {/* <FaCalendarDay className="ml-2" /> */}
            تأجير يومي
          </Button>

          <Button
            onClick={() => setActiveTab("monthly")}
            className={`px-8 py-6 text-lg rounded-full transition-all duration-300 ${
              activeTab === "monthly"
                ? "bg-primary text-white shadow-lg shadow-primary/30 hover:"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            {/* <FaCalendarAlt className="ml-2" /> */}
            تأجير شهري
          </Button>
        </div>
       <Stats/>
        {/* Swiper Slider - بدون أسهم ونقط */}
        <Swiper
          modules={[Autoplay]} // ✅ بس Autoplay
          spaceBetween={10}
          slidesPerView={2.2} // ✅ ٢.٥ كارت في الجوال
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: {
              slidesPerView: 2.5,
              spaceBetween: 7, // ✅ مسافة صغيرة جداً للجوال
            },
            640: {
              slidesPerView: 2.5,
              spaceBetween: 7, // ✅ مسافة متوسطة للجوال الكبير
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16, // ✅ مسافة مناسبة للتابلت
            },
            1024: {
              slidesPerView: 4.5,
              spaceBetween: 20, // ✅ مسافة أكبر للشاشات الكبيرة
            },
          }}
          className="px-4"
          dir="rtl"
          // ✅ إعدادات إضافية لتحسين السحب
          touchRatio={1.5}
          resistance={true}
          resistanceRatio={0.85}
          grabCursor={true}
          speed={800}
        >
          {filteredCars.map((car) => (
            <SwiperSlide key={car.id} className="mb-5 lg:mb-12">
              <Card className="hover:shadow-xl bg-white transition-all duration-300 hover:-translate-y-2 rounded-xl my-6">
                <CardContent className=" bg-white">
                  {/* صورة السيارة */}
                  <div className="h-28 lg:h-48  rounded-xl flex items-center justify-center relative overflow-hidden">
                    {/* <FaCar className="text-7xl text-primary/30" /> */}
                    <Image
                      src={car.image}
                      alt={car.name}
                      width={300}
                      height={200}
                      className="object-contain"
                    />
                    {/* <span className="absolute top-2 left-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                      {car.type === 'daily' ? 'يومي' : 'شهري'}
                    </span> */}
                  </div>

                  {/* معلومات السيارة */}
                  <div className="mt-4">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-[#A7A7A7] text-sm md:text-base font-bold">
                          {car.year}
                        </p>

                        <h3 className="text-sm lg:text-xl font-bold text-primary line-clamp-1">
                          {car.name}
                        </h3>
                      </div>

                      <span className=" w-full border-b border-gray-200 mb-1 md:mb-8 pb-2 md:pb-4 text-center text-[#0079AB] font-bold text-sm md:text-base">
                        {car.specs}
                      </span>
                    </div>

                    {/* السعر */}

                    <div className="flex items-center  justify-center gap-2">
                      <span className="text-sm lg:text-2xl font-bold text-primary">
                        {car.price}
                      </span>
                      <div className="flex lg:flex-col items-center">
                        <span className="text-sm text-primary">
                          {car.currency}
                        </span>
                        <span className="text-xs text-primary">
                          /{car.period}
                        </span>
                      </div>
                    </div>

                    {/* زر التأجير */}
                    {/* <Button 
                      onClick={() => handleRent(car.name)}
                      className="w-full mt-4 bg-primary hover: text-white rounded-xl py-5 transition-all duration-300 hover:shadow-lg"
                    >
                      اتأجير الآن
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* رسالة إذا لم توجد سيارات */}
        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد سيارات متاحة حالياً</p>
          </div>
        )}

        
          <Stats/>
        {/* Swiper Slider - بدون أسهم ونقط */}
        <Swiper
          modules={[Autoplay]} // ✅ بس Autoplay
          spaceBetween={10}
          slidesPerView={2.2} // ✅ ٢.٥ كارت في الجوال
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: {
              slidesPerView: 2.5,
              spaceBetween: 7, // ✅ مسافة صغيرة جداً للجوال
            },
            640: {
              slidesPerView: 2.5,
              spaceBetween: 7, // ✅ مسافة متوسطة للجوال الكبير
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16, // ✅ مسافة مناسبة للتابلت
            },
            1024: {
              slidesPerView: 4.5,
              spaceBetween: 20, // ✅ مسافة أكبر للشاشات الكبيرة
            },
          }}
          className="px-4"
          dir="rtl"
          // ✅ إعدادات إضافية لتحسين السحب
          touchRatio={1.5}
          resistance={true}
          resistanceRatio={0.85}
          grabCursor={true}
          speed={800}
        >
          {filteredCars.map((car) => (
            <SwiperSlide key={car.id}>
              <Card className="hover:shadow-xl bg-white transition-all duration-300 hover:-translate-y-2 rounded-xl my-6">
                <CardContent className=" bg-white">
                  {/* صورة السيارة */}
                  <div className="h-28 lg:h-48  rounded-xl flex items-center justify-center relative overflow-hidden">
                    {/* <FaCar className="text-7xl text-primary/30" /> */}
                    <Image
                      src={car.image}
                      alt={car.name}
                      width={300}
                      height={200}
                      className="object-contain"
                    />
                    {/* <span className="absolute top-2 left-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                      {car.type === 'daily' ? 'يومي' : 'شهري'}
                    </span> */}
                  </div>

                  {/* معلومات السيارة */}
                  <div className="mt-4">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-[#A7A7A7] text-sm md:text-base font-bold">
                          {car.year}
                        </p>

                        <h3 className="text-sm lg:text-xl font-bold text-primary line-clamp-1">
                          {car.name}
                        </h3>
                      </div>

                      <span className=" w-full border-b border-gray-200 mb-1 md:mb-8 pb-2 md:pb-4 text-center text-[#0079AB] font-bold text-sm md:text-base">
                        {car.specs}
                      </span>
                    </div>

                    {/* السعر */}

                    <div className="flex items-center  justify-center gap-2">
                      <span className="text-sm lg:text-2xl font-bold text-primary">
                        {car.price}
                      </span>
                      <div className="flex lg:flex-col items-center">
                        <span className="text-sm text-primary">
                          {car.currency}
                        </span>
                        <span className="text-xs text-primary">
                          /{car.period}
                        </span>
                      </div>
                    </div>

                    {/* زر التأجير */}
                    {/* <Button 
                      onClick={() => handleRent(car.name)}
                      className="w-full mt-4 bg-primary hover: text-white rounded-xl py-5 transition-all duration-300 hover:shadow-lg"
                    >
                      اتأجير الآن
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* رسالة إذا لم توجد سيارات */}
        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد سيارات متاحة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
}
