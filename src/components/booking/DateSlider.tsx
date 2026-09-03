// src/components/booking/DateSlider.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/src/lib/utils";

interface DateSliderProps {
  dates: Date[];
  selectedIndex: number;
  onSelect: (date: Date, index: number) => void;
}

export default function DateSlider({ dates, selectedIndex, onSelect }: DateSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [touchStartY, setTouchStartY] = useState(0);

  // تحديث الفهرس الحالي عند تغيير selectedIndex من الخارج
  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  // حساب التواريخ التي سيتم عرضها (2 فقط)
  const getVisibleDates = () => {
    if (dates.length === 0) return [];
    
    let centerIndex = currentIndex;
    if (centerIndex < 0) centerIndex = 0;
    if (centerIndex >= dates.length) centerIndex = dates.length - 1;
    
    // إذا كان هناك تاريخ واحد فقط
    if (dates.length === 1) {
      return [{ date: dates[0], index: 0, position: 'center' }];
    }
    
    // إذا كان التاريخ الحالي هو الأول
    if (centerIndex === 0) {
      return [
        { date: dates[0], index: 0, position: 'center' },
        { date: dates[1], index: 1, position: 'next' }
      ];
    }
    
    // إذا كان التاريخ الحالي هو الأخير
    if (centerIndex === dates.length - 1) {
      return [
        { date: dates[dates.length - 2], index: dates.length - 2, position: 'prev' },
        { date: dates[dates.length - 1], index: dates.length - 1, position: 'center' }
      ];
    }
    
    // في حالة وجود تاريخين فقط
    if (dates.length === 2) {
      if (centerIndex === 0) {
        return [
          { date: dates[0], index: 0, position: 'center' },
          { date: dates[1], index: 1, position: 'next' }
        ];
      } else {
        return [
          { date: dates[0], index: 0, position: 'prev' },
          { date: dates[1], index: 1, position: 'center' }
        ];
      }
    }
    
    // عرض التاريخ الحالي والتالي فقط
    return [
      { date: dates[centerIndex], index: centerIndex, position: 'center' },
      { date: dates[centerIndex + 1], index: centerIndex + 1, position: 'next' }
    ];
  };

  // دالة للتنقل بين التواريخ
  const navigateDate = (direction: 'prev' | 'next') => {
    let newIndex = currentIndex;
    if (direction === 'prev') {
      newIndex = Math.max(0, currentIndex - 1);
    } else {
      newIndex = Math.min(dates.length - 1, currentIndex + 1);
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      onSelect(dates[newIndex], newIndex);
    }
  };

  // أحداث السحب العمودي للماوس
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const deltaY = e.clientY - startY;
    
    if (deltaY < -30) {
      navigateDate('next');
      setIsDragging(false);
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    } 
    else if (deltaY > 30) {
      navigateDate('prev');
      setIsDragging(false);
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  // أحداث السحب العمودي للمس (الجوال)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const deltaY = e.touches[0].clientY - touchStartY;
    
    if (deltaY < -30) {
      navigateDate('next');
      setIsDragging(false);
    } 
    else if (deltaY > 30) {
      navigateDate('prev');
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const visibleDates = getVisibleDates();

  if (dates.length === 0) {
    return (
      <div className="text-center py-2 text-gray-500 text-sm">
        <p>لا توجد تواريخ متاحة</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none touch-none"
      style={{ 
        height: "140px",
        minHeight: "100px",
        cursor: 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-col items-center justify-center gap-1 h-full">
        {visibleDates.map((item) => {
          const isCenter = item.position === 'center';
          const uniqueKey = `${item.index}-${item.position}`;
          
          return (
            <div
              key={uniqueKey}
              className={cn(
                "date-item shrink-0 px-4 py-2 rounded-xl text-center transition-all duration-300 cursor-pointer w-full max-w-xs",
                isCenter 
                  ? "scale-100 opacity-100 bg-[#E8F8FF8F] border-2 border-[#E8F8FF]  " 
                  : "scale-90 opacity-40"
              )}
              style={{
                backgroundColor: isCenter ? '#E8F8FF8F' : 'transparent',
                border: isCenter ? '2px solid #E8F8FF' : 'none'
              }}
              onClick={() => {
                if (!isCenter) {
                  onSelect(item.date, item.index);
                  setCurrentIndex(item.index);
                }
              }}
            >
              <div className={cn(
                "flex items-center justify-center gap-2",
                isCenter ? "py-1" : "py-0.5"
              )}>
                <span className={cn(
                  "font-medium",
                  isCenter 
                    ? "text-sm text-gray-800" 
                    : "text-xs text-gray-400"
                )}>
                  {format(item.date, "EEEE", { locale: ar })}
                </span>
                <span className={cn(
                  "font-bold",
                  isCenter 
                    ? "text-base text-primary" 
                    : "text-xs text-gray-400"
                )}>
                  {format(item.date, "dd-MM-yyyy")}
                </span>
                {/* {isCenter && (
                  <div className="w-8 h-0.5 bg-primary rounded-full absolute -bottom-0.5"></div>
                )} */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}