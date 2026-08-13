"use client";
import FeaturedCars from "@/src/components/home/FeaturedCars";
import HeroSliderSwiper from "@/src/components/home/HeroSliderSwiper";
import DownloadSection from "@/src/components/home/downloadSection";
export default function Home() {
  return (
    <>
      <HeroSliderSwiper />

      <FeaturedCars />

      <DownloadSection />
    </>
  );
}
