/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Card, CardContent } from "@/src/ui/card";
import { Button } from "@/src/ui/button";
import { FaCalendarDay, FaCalendarAlt } from "react-icons/fa";
import Stats from "./Stats";
import "swiper/css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CarService } from "@/src/services/carService";
import { Car } from "@/src/types/car";
import {
  DailyCarsResponse,
  MonthlyCarsResponse,
  MonthlyCar,
} from "@/src/types/api";
import { LuShieldCheck } from "react-icons/lu";
import { CiDeliveryTruck } from "react-icons/ci";
import { TbClockHour3 } from "react-icons/tb";

interface ProviderGroup {
  providerId: number;
  providerName: string;
  providerImage: string;
  acceptanceRate: number;
  customerSatisfactionRate: number;
  deliverySpeedRate: number;
  city: string;
  district: string;
  averageRating: number;
  countReviews: number;
  cars: Car[];
  quickPolicy: {
    pickupWithinHourText: string;
    deductibleText: string;
    kmLimitText: string;
  };
  icons: {
    id: number;
    title: string;
    image: string;
  }[];
}

function ProviderStats({ provider }: { provider: ProviderGroup }) {
  const features = provider.icons.map((icon) => ({
    icon: (
      <Image
        src={icon.image}
        alt={icon.title}
        width={20}
        height={20}
        className="object-contain w-5 h-5 lg:w-7 lg:h-7"
      />
    ),
    title: icon.title,
  }));

  const defaultFeatures = [
    { icon: <LuShieldCheck className="text-xl" />, title: "بدون تأمين مسترد" },
    { icon: <CiDeliveryTruck className="text-xl" />, title: "توصيل مجاني" },
    {
      icon: <TbClockHour3 className="text-xl" />,
      title: "تأخير مجاني عند الإرجاع",
    },
  ];

  return (
    <Stats
      providerName={provider.providerName}
      providerImage={provider.providerImage || "/images/is.png"}
      city={provider.city || "المدينة"}
      district={provider.district || "الحي"}
      averageRating={provider.averageRating || 0}
      countReviews={provider.countReviews || 0}
      acceptanceRate={provider.acceptanceRate || 0}
      customerSatisfactionRate={provider.customerSatisfactionRate || 0}
      deliverySpeedRate={provider.deliverySpeedRate || 0}
      isVerified={true}
      features={features.length > 0 ? features : defaultFeatures}
    />
  );
}

function CarCard({
  car,
  period,
  onClick,
}: {
  car: any;
  period: string;
  onClick: () => void;
}) {
  const price =
    car.pricePerDayAfterDiscount ||
    car.pricePerDay ||
    car.monthly_price_after_discount ||
    car.monthly_price;
  const image = car.image_url || car.image;
  const name = car.name;
  const year = car.model_year || car.year;
  const brand = car.brand?.name || car.brand || "";
  const discount = car.discount || 0;

  return (
    <Card
      onClick={onClick}
      className="hover:shadow-xl bg-white transition-all duration-300 hover:-translate-y-2 rounded-xl my-6 cursor-pointer"
    >
      <CardContent className="bg-white p-4">
        <div className="h-28 lg:h-48 rounded-xl flex items-center justify-center relative overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={300}
            height={200}
            className="object-contain"
            priority
          />
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              خصم {discount}%
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center justify-center gap-2">
              <p className="text-[#A7A7A7] text-sm md:text-base font-bold">
                {year}
              </p>
              <h3 className="text-sm lg:text-xl font-bold text-primary line-clamp-1">
                {name}
              </h3>
            </div>
            <span className="w-full border-b border-gray-200 mb-1 md:mb-8 pb-2 md:pb-4 text-center text-[#0079AB] font-bold text-sm md:text-base">
              {brand}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm lg:text-2xl font-bold text-primary">
              {price}
            </span>
            <div className="flex lg:flex-col items-center">
              <span className="text-xs lg:text-sm text-primary">ر.س</span>
              <span className="text-xs text-primary">/ {period}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FeaturedCars() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("daily");
  const [providerGroups, setProviderGroups] = useState<ProviderGroup[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyCarsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (tab: string) => {
    setLoading(true);
    setError(null);
    try {
      if (tab === "daily") {
        const data = await CarService.getDailyCarsRaw();
        const groups = transformToProviderGroups(data);
        setProviderGroups(groups);
        setMonthlyData(null);
      } else {
        const data = await CarService.getMonthlyCars();
        setMonthlyData(data);
        setProviderGroups([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  const transformToProviderGroups = (
    data: DailyCarsResponse[],
  ): ProviderGroup[] => {
    return data.map((provider) => ({
      providerId: provider.id,
      providerName: provider.name,
      providerImage: provider.image_url,
      acceptanceRate: provider.acceptance_rate || 0,
      customerSatisfactionRate: provider.customer_satisfaction_rate || 0,
      deliverySpeedRate: provider.delivery_speed_rate || 0,
      city: provider.city || "المدينة",
      district: provider.district || "الحي",
      averageRating: provider.average_rating || 0,
      countReviews: provider.count_reviews || 0,
      quickPolicy: {
        pickupWithinHourText:
          provider.quick_policy?.pickup_within_hour_text || "",
        deductibleText: provider.quick_policy?.deductible_text || "",
        kmLimitText: provider.quick_policy?.km_limit_text || "",
      },
      icons:
        provider.icons?.map((icon) => ({
          id: icon.id,
          title: icon.title,
          image: icon.icon || icon.image,
        })) || [],
      cars: provider.cars.map((carAPI) => ({
        id: carAPI.id,
        name: carAPI.name,
        brand: carAPI.brand?.name || "غير معروف",
        brandLogo: carAPI.brand?.image_url || "",
        model: carAPI.brand?.name || "",
        year: carAPI.model_year,
        pricePerDay: carAPI.price_per_day,
        pricePerDayAfterDiscount: carAPI.price_per_day_after_discount,
        discount: carAPI.discount,
        image: carAPI.image_url,
        category: carAPI.car_category?.name || "غير معروف",
        categoryId: carAPI.car_category?.id,
        minimumDays: carAPI.minimum_days,
        isFeatured: carAPI.is_featured,
        status: carAPI.status,
        providerId: provider.id,
        providerName: provider.name,
        providerImage: provider.image_url,
        acceptanceRate: provider.acceptance_rate,
        customerSatisfactionRate: provider.customer_satisfaction_rate,
        deliverySpeedRate: provider.delivery_speed_rate,
        quickPolicy: {
          pickupWithinHourText:
            provider.quick_policy?.pickup_within_hour_text || "",
          deductibleText: provider.quick_policy?.deductible_text || "",
          kmLimitText: provider.quick_policy?.km_limit_text || "",
        },
        icons:
          provider.icons?.map((icon) => ({
            id: icon.id,
            title: icon.title,
            image: icon.icon || icon.image,
          })) || [],
        averageRating: provider.average_rating,
        countReviews: provider.count_reviews,
      })),
    }));
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleCarClick = (carId: string | number, providerId?: number) => {
    if (!carId) {
      console.error("❌ Missing carId");
      return;
    }

    if (!providerId) {
      console.error("❌ Missing providerId for car:", carId);
      return;
    }

    const url = `/cars/${carId}?type=${activeTab}&officeId=${providerId}`;

    router.push(url);
  };

  const renderMonthlySections = () => {
    if (!monthlyData) return null;

    const sections = Object.entries(monthlyData)
      .filter(([key, value]) => value?.cars?.length > 0)
      .map(([key, value]) => ({
        key,
        title: value.title || key,
        data: value,
      }));

    return sections.map(({ key, title, data }) => (
      <div key={key} className="mb-8 lg:mb-12">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4">
          {title}
        </h3>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={2.2}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            480: { slidesPerView: 2.5, spaceBetween: 7 },
            640: { slidesPerView: 2.5, spaceBetween: 7 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4.5, spaceBetween: 20 },
          }}
          className="px-4"
          dir="rtl"
          touchRatio={1.5}
          resistance={true}
          resistanceRatio={0.85}
          grabCursor={true}
          speed={800}
        >
          {data.cars.map((car: MonthlyCar) => (
            <SwiperSlide key={car.id} className="mb-5 lg:mb-12">
              <CarCard
                car={car}
                period="شهرياً"
                onClick={() => handleCarClick(car.id, car.office?.id)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-100">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <section className="py-2 pt-4 lg:pt-8">
      <div className="container mx-auto px-2">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-primary">
          احجز الان
        </h2>

        <div className="flex justify-center gap-4 mb-10">
          <Button
            onClick={() => setActiveTab("daily")}
            className={`px-6 py-5 text-base lg:px-8 lg:py-6 lg:text-lg rounded-full transition-all duration-300 ${
              activeTab === "daily"
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            <FaCalendarDay className="ml-2" />
            تأجير يومي
          </Button>

          <Button
            onClick={() => setActiveTab("monthly")}
            className={`px-6 py-5 text-base lg:px-8 lg:py-6 lg:text-lg rounded-full transition-all duration-300 ${
              activeTab === "monthly"
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-primary hover:text-primary"
            }`}
          >
            <FaCalendarAlt className="ml-2" />
            تأجير شهري
          </Button>
        </div>

        {activeTab === "daily" ? (
          providerGroups.length > 0 ? (
            providerGroups.map((group) => (
              <div key={group.providerId} className="mb-12">
                <ProviderStats provider={group} />

                {group.cars.length > 0 ? (
                  <Swiper
                    modules={[Autoplay]}
                    spaceBetween={10}
                    slidesPerView={2.2}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    breakpoints={{
                      480: { slidesPerView: 2.5, spaceBetween: 7 },
                      640: { slidesPerView: 2.5, spaceBetween: 7 },
                      768: { slidesPerView: 3, spaceBetween: 16 },
                      1024: { slidesPerView: 4.5, spaceBetween: 20 },
                    }}
                    className="px-4"
                    dir="rtl"
                    touchRatio={1.5}
                    resistance={true}
                    resistanceRatio={0.85}
                    grabCursor={true}
                    speed={800}
                  >
                    {group.cars.map((car) => (
                      <SwiperSlide key={car.id} className="mb-5 lg:mb-12">
                        <CarCard
                          car={car}
                          period="يومياً"
                          onClick={() => handleCarClick(car.id, car.providerId)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <p className="text-gray-400">
                      لا توجد سيارات متاحة لهذه الشركة
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                لا توجد شركات سيارات متاحة حالياً
              </p>
            </div>
          )
        ) : (
          renderMonthlySections() || (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                لا توجد سيارات شهرية متاحة حالياً
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
