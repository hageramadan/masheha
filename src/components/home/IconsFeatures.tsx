// src/components/IconsFeatures.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface IconData {
  id: number;
  title: string;
  image: string;
  icon: string;
  top: boolean;
  rental_company_id: number | null;
}

interface ApiResponse {
  result: boolean;
  errNum: number;
  message: string;
  data: {
    icons: IconData[];
  };
}

export default function IconsFeatures() {
  const [icons, setIcons] = useState<IconData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIcons = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://admin.masheha.com/api/icons", {
          headers: {
            "accept-language": "ar",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponse = await response.json();
        if (data.result && data.data.icons) {
          setIcons(data.data.icons);
        } else {
          setError("تعذر تحميل الأيقونات");
        }
      } catch (err) {
        console.error("Error fetching icons:", err);
        setError("حدث خطأ في تحميل الأيقونات");
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8 bg-white">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <></>;
  }

  if (icons.length === 0) {
    return null;
  }

  
  const firstFourIcons = icons.slice(0, 4);
  const remainingIcons = icons.slice(4, 7);

  return (
    <div className="bg-white py-4 px-1 lg:px-2 rounded-xl my-4 lg:my-8 mx-2 lg:mx-auto">
    
<div className="grid grid-cols-4 gap-1 lg:gap-4 mb-2">
  {firstFourIcons.map((icon, index) => (
    <div key={icon.id} className="relative">
      <div
        className="flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-3 p-1 lg:p-4 rounded-[8px]  transition-colors"
      >
        <Image
          src={icon.image}
          alt={icon.title}
          width={24}
          height={24}
          className="w-5 h-5 lg:w-7 lg:h-7 object-contain"
        />
        <p className="text-gray-800 font-semibold text-[9px] md:text-xs lg:text-base text-center lg:text-start">
          {icon.title}
        </p>
      </div>
      
     
      {index === 0 && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 lg:h-12 bg-gray-200"></div>
      )}
      {index === 1  && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 lg:h-12 bg-gray-200"></div>
      )}
      {index === 2&& (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 lg:h-12 bg-gray-200"></div>
      )}
    </div>
  ))}
</div>

      
      {remainingIcons.length > 0 && (
        <div className="grid grid-cols-3 gap-2 lg:gap-4">
          {remainingIcons.map((icon) => (
            <div
              key={icon.id}
              className="flex items-center justify-center gap-1 lg:gap-3 p-1 lg:p-4 bg-[#0127380A] rounded-[8px] hover:bg-gray-200 transition-colors"
            >
              <Image
                src={icon.image}
                alt={icon.title}
                width={24}
                height={24}
                className="w-4 h-4 lg:w-7 lg:h-7 object-contain"
              />
              <p className="font-semibold text-gray-800 text-[9px] md:text-sm lg:text-base">
                {icon.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}