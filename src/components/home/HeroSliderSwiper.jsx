'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'; // ✅ شيلنا Navigation
import { Button } from '@/src/ui/button';
import { FaCar } from 'react-icons/fa';
import { toast } from 'sonner';
import Image from 'next/image';
import DownloadApp from '@/src/components/common/DownloadApp';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    id: 1,
    title: 'استأجر سيارتك المثالية',
    subtitle: 'نوفر لك أفضل خدمات تأجير السيارات بأسعار تنافسية وخطوات بسيطة',
    buttonText: 'ابدأ الحجز الآن',
    image: '/images/hero.png',
    color: 'from-blue-600 to-blue-800',
  },
   {
    id: 2,
    title: 'استأجر سيارتك المثالية',
    subtitle: 'نوفر لك أفضل خدمات تأجير السيارات بأسعار تنافسية وخطوات بسيطة',
    buttonText: 'ابدأ الحجز الآن',
    image: '/images/cars/c1.webp',
    color: 'from-blue-600 to-blue-800',
  },
  
   {
    id: 3,
    title: 'استأجر سيارتك المثالية',
    subtitle: 'نوفر لك أفضل خدمات تأجير السيارات بأسعار تنافسية وخطوات بسيطة',
    buttonText: 'ابدأ الحجز الآن',
    image: '/images/cars/c3.jpg',
    color: 'from-blue-600 to-blue-800',
  },
   {
    id: 5,
    title: 'استأجر سيارتك المثالية',
    subtitle: 'نوفر لك أفضل خدمات تأجير السيارات بأسعار تنافسية وخطوات بسيطة',
    buttonText: 'ابدأ الحجز الآن',
    image: '/images/cars/c4.jpg',
    color: 'from-blue-600 to-blue-800',
  },
//   {
//     id: 2,
//     title: 'خصم ٢٠٪ على أول حجز',
//     subtitle: 'عروض حصرية للعملاء الجدد',
//     buttonText: 'استفد من العرض',
//     image: '/images/hero.png',
//     color: 'from-green-600 to-green-800',
//   },
//   {
//     id: 3,
//     title: 'أحدث موديلات السيارات',
//     subtitle: 'تشكيلة واسعة من السيارات الفاخرة',
//     buttonText: 'شاهد السيارات',
//     image: '/images/hero.png',
//     color: 'from-purple-600 to-purple-800',
//   },
];

export default function HeroSliderSwiper() {
  const handleRent = () => {
    toast.success('🎉 تم الحجز بنجاح!', {
      description: 'سنتواصل معك خلال ٢٤ ساعة لتأكيد الحجز',
      duration: 5000,
    });
  };

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]} // ✅ شيلنا Navigation من هنا
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        // ✅ شيلنا navigation: true
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-[500px] md:h-[600px] lg:h-[700px]"
        dir="rtl"
        // ✅ إعدادات إضافية لتحسين السحب باليد
        touchRatio={1.5}           // نسبة حساسية اللمس
        resistance={true}          // مقاومة عند نهاية السلايدر
        resistanceRatio={0.85}     // مقدار المقاومة
        grabCursor={true}          // تغيير شكل الماوس عند السحب
        speed={800}                // سرعة الانتقال
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              <div className={`absolute inset-0 bg-black/50 opacity-75`} />
              <div className="absolute inset-0 flex items-center justify-start">
                <div className="container mx-auto px-4 text-white">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-[#D2D6DB]">
                    {slide.subtitle}
                  </p>
                  {/* <Button 
                    onClick={handleRent}
                    className="bg-white text-primary hover:bg-gray-100 hover:scale-105 text-lg px-8 py-6 rounded-full shadow-xl transition-all duration-300"
                  >
                    <FaCar className="ml-2" />
                    {slide.buttonText}
                  </Button> */}
                  <div className='mt-2 md:mt-4'>
                  <DownloadApp/>

                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}