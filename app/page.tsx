"use client";
import { Suspense } from 'react';
import FeaturedCars from "@/src/components/home/FeaturedCars";
import HeroSliderSwiper from "@/src/components/home/HeroSliderSwiper";
import DownloadSection from "@/src/components/home/downloadSection";
import LoadingScreen from "@/src/components/common/LoadingScreen";

export default function Home() {
  return (
    <LoadingScreen>
      <div className='bg-[#FCF9F4]'>
    <HeroSliderSwiper />
      <FeaturedCars />
      <DownloadSection />
      </div>
  
    </LoadingScreen>
  );
}