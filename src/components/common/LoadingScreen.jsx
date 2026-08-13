"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaCar } from "react-icons/fa";

export default function LoadingScreen({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحميل الصفحة
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // 2 ثانية - عدليها حسب الحاجة

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="relative mb-8">
          <Image
            src="/logo.png"
            alt="شعار الشركة"
            width={180}
            height={80}
            className="object-contain"
            priority
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
