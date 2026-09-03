// src/components/booking/TimeSlider.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";

interface TimeSliderProps {
  times: string[];
  selectedIndex: number;
  onSelect: (time: string, index: number) => void;
  formatTime: (time: string) => string;
}

export default function TimeSlider({ 
  times, 
  selectedIndex, 
  onSelect, 
  formatTime 
}: TimeSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [touchStartY, setTouchStartY] = useState(0);

  // تحديث الفهرس الحالي عند تغيير selectedIndex من الخارج
  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  // حساب الأوقات التي سيتم عرضها (2 فقط)
  const getVisibleTimes = () => {
    if (times.length === 0) return [];
    
    let centerIndex = currentIndex;
    if (centerIndex < 0) centerIndex = 0;
    if (centerIndex >= times.length) centerIndex = times.length - 1;
    
    // إذا كان هناك وقت واحد فقط
    if (times.length === 1) {
      return [{ time: times[0], index: 0, position: 'center' }];
    }
    
    // إذا كان الوقت الحالي هو الأول
    if (centerIndex === 0) {
      return [
        { time: times[0], index: 0, position: 'center' },
        { time: times[1], index: 1, position: 'next' }
      ];
    }
    
    // إذا كان الوقت الحالي هو الأخير
    if (centerIndex === times.length - 1) {
      return [
        { time: times[times.length - 2], index: times.length - 2, position: 'prev' },
        { time: times[times.length - 1], index: times.length - 1, position: 'center' }
      ];
    }
    
    // في حالة وجود وقتين فقط
    if (times.length === 2) {
      if (centerIndex === 0) {
        return [
          { time: times[0], index: 0, position: 'center' },
          { time: times[1], index: 1, position: 'next' }
        ];
      } else {
        return [
          { time: times[0], index: 0, position: 'prev' },
          { time: times[1], index: 1, position: 'center' }
        ];
      }
    }
    
    // عرض الوقت الحالي والتالي فقط
    return [
      { time: times[centerIndex], index: centerIndex, position: 'center' },
      { time: times[centerIndex + 1], index: centerIndex + 1, position: 'next' }
    ];
  };

  // دالة للتنقل بين الأوقات
  const navigateTime = (direction: 'prev' | 'next') => {
    let newIndex = currentIndex;
    if (direction === 'prev') {
      newIndex = Math.max(0, currentIndex - 1);
    } else {
      newIndex = Math.min(times.length - 1, currentIndex + 1);
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      onSelect(times[newIndex], newIndex);
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
      navigateTime('next');
      setIsDragging(false);
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    } 
    else if (deltaY > 30) {
      navigateTime('prev');
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
      navigateTime('next');
      setIsDragging(false);
    } 
    else if (deltaY > 30) {
      navigateTime('prev');
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const visibleTimes = getVisibleTimes();

  if (times.length === 0) {
    return (
      <div className="text-center py-2 text-gray-500 text-sm">
        <p>لا توجد أوقات متاحة</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden select-none touch-none"
      style={{ 
        height: "120px",
        minHeight: "80px",
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
        {visibleTimes.map((item) => {
          const isCenter = item.position === 'center';
          const formattedTime = formatTime(item.time);
          const uniqueKey = `${item.index}-${item.position}`;
          
          return (
            <div
              key={uniqueKey}
              className={cn(
                "time-item shrink-0 px-4 py-2 rounded-xl text-center transition-all duration-300 cursor-pointer w-full max-w-xs",
                isCenter 
                  ? "scale-100 opacity-100 bg-[#E8F8FF8F] border-2 border-[#E8F8FF]" 
                  : "scale-90 opacity-40"
              )}
              style={{
                backgroundColor: isCenter ? '#E8F8FF8F' : 'transparent',
                border: isCenter ? '2px solid #E8F8FF' : 'none'
              }}
              onClick={() => {
                if (!isCenter) {
                  onSelect(item.time, item.index);
                  setCurrentIndex(item.index);
                }
              }}
            >
              <div className={cn(
                "flex items-center justify-center",
                isCenter ? "py-1" : "py-0.5"
              )}>
                <span className={cn(
                  "font-bold",
                  isCenter 
                    ? "text-base text-primary" 
                    : "text-xs text-gray-400"
                )}>
                  {formattedTime}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}