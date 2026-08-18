"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Card, CardContent } from "@/src/ui/card";
import { Button } from "@/src/ui/button";
import { FaCar, FaCalendarDay, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { toast } from "sonner";
import Stats from "./Stats";
import "swiper/css";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    specs: "1953",
    description: "سيارة مدمجة ممتازة للاستخدام اليومي مع استهلاك اقتصادي للوقود",
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    specs: "2490",
    description: "سيارة سيدان فاخرة مع أداء قوي وراحة عالية",
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    specs: "2350",
    description: "سيارة سيدان أنيقة مع تقنيات حديثة وراحة فائقة",
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    specs: "5600",
    description: "سيارة دفع رباعي قوية مثالية للمغامرات والطرق الوعرة",
    seats: 7,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    specs: "2750",
    description: "شاحنة متعددة الاستخدامات قوية ومتينة",
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "ديزل",
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
    specs: "2990",
    description: "سيارة فاخرة تجمع بين الأداء العالي والأناقة الألمانية",
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    specs: "3000",
    description: "سيارة SUV فاخرة مع أداء رياضي وتقنيات متطورة",
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    specs: "2960",
    description: "سيارة SUV عائلية فاخرة مع مساحة داخلية واسعة",
    seats: 7,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    specs: "2750",
    description: "سيارة SUV سويدية تجمع بين الأمان الفائق والتصميم الأنيق",
    seats: 7,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
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
    specs: "3500",
    description: "سيارة SUV فاخرة مع أعلى مستويات الفخامة والأداء",
    seats: 7,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
  },
];

export default function FeaturedCars() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("daily");

  const filteredCars = cars.filter((car) => car.type === activeTab);

  const handleCarClick = (carId: number) => {
    router.push(`/cars/${carId}`);
  };

  const handleRent = (e: React.MouseEvent, carName: string) => {
    e.stopPropagation(); // منع الانتقال إلى تفاصيل السيارة عند الضغط على زر التأجير
    toast.success(`🚗 تم تأجير ${carName} بنجاح!`, {
      description: "سنتواصل معك خلال ٢٤ ساعة لتأكيد التأجير",
      duration: 5000,
    });
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-primary">
          احجز الان
        </h2>

        {/* أزرار التبديل */}
        <div className="flex justify-center gap-4 mb-10">
          <Button
            onClick={() => setActiveTab("daily")}
            className={`px-8 py-6 text-lg rounded-full transition-all duration-300 ${
              activeTab === "daily"
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            تأجير يومي
          </Button>

          <Button
            onClick={() => setActiveTab("monthly")}
            className={`px-8 py-6 text-lg rounded-full transition-all duration-300 ${
              activeTab === "monthly"
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            تأجير شهري
          </Button>
        </div>
        
        <Stats />

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={2.2}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: {
              slidesPerView: 2.5,
              spaceBetween: 7,
            },
            640: {
              slidesPerView: 2.5,
              spaceBetween: 7,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4.5,
              spaceBetween: 20,
            },
          }}
          className="px-4"
          dir="rtl"
          touchRatio={1.5}
          resistance={true}
          resistanceRatio={0.85}
          grabCursor={true}
          speed={800}
        >
          {filteredCars.map((car) => (
            <SwiperSlide key={car.id} className="mb-5 lg:mb-12">
              <Card 
                onClick={() => handleCarClick(car.id)}
                className="hover:shadow-xl bg-white transition-all duration-300 hover:-translate-y-2 rounded-xl my-6 cursor-pointer"
              >
                <CardContent className="bg-white">
                  {/* صورة السيارة */}
                  <div className="h-28 lg:h-48 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.name}
                      width={300}
                      height={200}
                      className="object-contain"
                    />
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
                      <span className="w-full border-b border-gray-200 mb-1 md:mb-8 pb-2 md:pb-4 text-center text-[#0079AB] font-bold text-sm md:text-base">
                        {car.specs}
                      </span>
                    </div>

                    {/* السعر */}
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm lg:text-2xl font-bold text-primary">
                        {car.price}
                      </span>
                      <div className="flex lg:flex-col items-center">
                        <span className="text-sm text-primary">{car.currency}</span>
                        <span className="text-xs text-primary">/{car.period}</span>
                      </div>
                    </div>

                    {/* زر التأجير */}
                    {/* <Button 
                      onClick={(e) => handleRent(e, car.name)}
                      className="w-full mt-4 bg-primary hover:bg-primary/90 text-white rounded-xl py-5 transition-all duration-300 hover:shadow-lg"
                    >
                      تأجير الآن
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد سيارات متاحة حالياً</p>
          </div>
        )}

        <Stats />

        {/* Swiper Slider الثاني */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={2.2}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: {
              slidesPerView: 2.5,
              spaceBetween: 7,
            },
            640: {
              slidesPerView: 2.5,
              spaceBetween: 7,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 4.5,
              spaceBetween: 20,
            },
          }}
          className="px-4"
          dir="rtl"
          touchRatio={1.5}
          resistance={true}
          resistanceRatio={0.85}
          grabCursor={true}
          speed={800}
        >
          {filteredCars.map((car) => (
            <SwiperSlide key={car.id}>
              <Card 
                onClick={() => handleCarClick(car.id)}
                className="hover:shadow-xl bg-white transition-all duration-300 hover:-translate-y-2 rounded-xl my-6 cursor-pointer"
              >
                <CardContent className="bg-white">
                  <div className="h-28 lg:h-48 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.name}
                      width={300}
                      height={200}
                      className="object-contain"
                    />
                  </div>

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
                      <span className="w-full border-b border-gray-200 mb-1 md:mb-8 pb-2 md:pb-4 text-center text-[#0079AB] font-bold text-sm md:text-base">
                        {car.specs} سي سي
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm lg:text-2xl font-bold text-primary">
                        {car.price}
                      </span>
                      <div className="flex lg:flex-col items-center">
                        <span className="text-xs lg:text-sm text-primary">{car.currency}</span>
                        <span className="text-xs text-primary">/{car.period}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={(e) => handleRent(e, car.name)}
                      className="w-full mt-4 bg-primary hover:bg-primary/90 text-white rounded-xl py-5 transition-all duration-300 hover:shadow-lg"
                    >
                      تأجير الآن
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد سيارات متاحة حالياً</p>
          </div>
        )}
      </div>
    </section>
  );
}