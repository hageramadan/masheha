"use client";

import { useState, useCallback } from "react";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import FeaturedCars from "@/src/components/home/FeaturedCars";
import HeroSliderSwiper from "@/src/components/home/HeroSliderSwiper";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleFeaturedCarsLoad = useCallback(() => {
    console.log("✅ FeaturedCars loaded - hiding loading screen");
    setIsLoading(false);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      <div
        className={
          isLoading
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-500"
        }
      >
        <div className="bg-[#FCF9F4]">
          <HeroSliderSwiper />

          <FeaturedCars onLoad={handleFeaturedCarsLoad} />
        </div>
      </div>
    </>
  );
}