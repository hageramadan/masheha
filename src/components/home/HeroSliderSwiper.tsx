'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'; 
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

];

export default function HeroSliderSwiper() {
 

  return (
    <section className="relative mt-12">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]} 
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
       
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
       className="h-[35vh] md:h-[45vh] lg:h-[55vh]"
        dir="rtl"
        
        touchRatio={1.5}          
        resistance={true}          
        resistanceRatio={0.85}     
        grabCursor={true}          
        speed={800}                
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
                  <h1 className="text-lg md:text-5xl lg:text-6xl font-bold  lg:mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-base md:text-2xl lg:text-3xl lg:mb-8 text-[#D2D6DB]">
                    {slide.subtitle}
                  </p>
                  {/* <Button 
                    onClick={handleRent}
                    className="bg-white text-primary hover:bg-gray-100 hover:scale-105 text-lg px-8 py-6 rounded-full shadow-xl transition-all duration-300"
                  >
                    <FaCar className="ml-2" />
                    {slide.buttonText}
                  </Button> */}
                  <div className='my-4'>
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

// 'use client';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
// import { toast } from 'react-hot-toast';
// import Image from 'next/image';
// import DownloadApp from '@/src/components/common/DownloadApp';
// import { useState, useEffect } from 'react';
// import { CarService } from '@/src/services/carService';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';


// const DEFAULT_IMAGE = '/images/hero.png';

// export default function HeroSliderSwiper() {
//   const [slides, setSlides] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchSliders = async () => {
//       try {
//         setIsLoading(true);
//         const response = await CarService.getSliders();
        

//         const slidesData = response.addresses.map((item) => ({
//           id: item.id,
//           title: item.title || 'استأجر سيارتك المثالية',
//           subtitle: 'نوفر لك أفضل خدمات تأجير السيارات بأسعار تنافسية وخطوات بسيطة',
//           buttonText: 'ابدأ الحجز الآن',
//           image: item.image || DEFAULT_IMAGE,
//           color: 'from-blue-600 to-blue-800',
//         }));

//         // إذا لم توجد صور، استخدم الصورة الافتراضية
//         if (slidesData.length === 0) {
//           setSlides([
//             {
//               id: 1,
//               title: 'استأجر سيارتك المثالية',
//               subtitle: 'نوفر لك أفضل خدمات تأجير السيارات بأسعار تنافسية وخطوات بسيطة',
//               buttonText: 'ابدأ الحجز الآن',
//               image: DEFAULT_IMAGE,
//               color: 'from-blue-600 to-blue-800',
//             }
//           ]);
//         } else {
//           setSlides(slidesData);
//         }
//       } catch (error) {
//         console.error('Error fetching sliders:', error);
//         // في حالة الخطأ، استخدم الصورة الافتراضية
//         setSlides([
//           {
//             id: 1,
//             title: 'استأجر سيارتك المثالية',
//             subtitle: 'نوفر لك أفضل خدمات تأجير السيارات بأسعار تنافسية وخطوات بسيطة',
//             buttonText: 'ابدأ الحجز الآن',
//             image: DEFAULT_IMAGE,
//             color: 'from-blue-600 to-blue-800',
//           }
//         ]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchSliders();
//   }, []);

//   const handleRent = () => {
//     toast.success('🎉 تم الحجز بنجاح!', {
//       description: 'سنتواصل معك خلال ٢٤ ساعة لتأكيد الحجز',
//       duration: 5000,
//     });
//   };

//   // حالة التحميل
//   if (isLoading) {
//     return (
//       <section className="relative h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center bg-gray-100">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-500">جاري تحميل الصور...</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="relative">
//       <Swiper
//         modules={[Autoplay, Pagination, EffectFade]}
//         effect="fade"
//         spaceBetween={0}
//         slidesPerView={1}
//         pagination={{
//           clickable: true,
//           dynamicBullets: true,
//         }}
//         autoplay={{
//           delay: 5000,
//           disableOnInteraction: false,
//         }}
//         loop={true}
//         className="h-[500px] md:h-[600px] lg:h-[700px]"
//         dir="rtl"
//         touchRatio={1.5}
//         resistance={true}
//         resistanceRatio={0.85}
//         grabCursor={true}
//         speed={800}
//       >
//         {slides.map((slide) => (
//           <SwiperSlide key={slide.id}>
//             <div className="relative h-full w-full">
//               <Image
//                 src={slide.image}
//                 alt={slide.title}
//                 fill
//                 className="object-cover"
//                 priority
//                 onError={(e) => {
//                   // في حالة فشل تحميل الصورة، استخدم الصورة الافتراضية
//                   const target = e.target as HTMLImageElement;
//                   target.src = DEFAULT_IMAGE;
//                 }}
//               />
//               <div className="absolute inset-0 bg-black/50 opacity-75" />
//               <div className="absolute inset-0 flex items-center justify-start">
//                 <div className="container mx-auto px-4 text-white">
//                   <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
//                     {slide.title}
//                   </h1>
//                   <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-[#D2D6DB]">
//                     {slide.subtitle}
//                   </p>
//                   <div className='mt-2 md:mt-4'>
//                     <DownloadApp />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// }