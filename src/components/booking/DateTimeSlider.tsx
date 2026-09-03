// src/components/booking/DateTimeSlider.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/src/lib/utils";

interface DateTimeSliderProps {
  dates: Date[];
  times: string[];
  selectedDateIndex: number;
  selectedTimeIndex: number;
  onDateSelect: (date: Date, index: number) => void;
  onTimeSelect: (time: string, index: number) => void;
  formatTime: (time: string) => string;
  isLoading: boolean;
}

export default function DateTimeSlider({
  dates,
  times,
  selectedDateIndex,
  selectedTimeIndex,
  onDateSelect,
  onTimeSelect,
  formatTime,
  isLoading,
}: DateTimeSliderProps) {
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const timeContainerRef = useRef<HTMLDivElement>(null);

  const [isDateDragging, setIsDateDragging] = useState(false);
  const [isTimeDragging, setIsTimeDragging] = useState(false);
  const [dateStartY, setDateStartY] = useState(0);
  const [timeStartY, setTimeStartY] = useState(0);
  const [currentDateIndex, setCurrentDateIndex] = useState(selectedDateIndex);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(selectedTimeIndex);

  // تحديث المؤشرات عند تغييرها من الخارج
  useEffect(() => {
    setCurrentDateIndex(selectedDateIndex);
  }, [selectedDateIndex]);

  useEffect(() => {
    setCurrentTimeIndex(selectedTimeIndex);
  }, [selectedTimeIndex]);

  // حساب العناصر التي سيتم عرضها (3 لكل منها)
  const getVisibleItems = (items: any[], currentIndex: number) => {
  if (items.length === 0) return [];

  const result = [];

  const prevIndex = currentIndex - 1;
  const nextIndex = currentIndex + 1;

  // العنصر السابق أو مساحة فارغة
  if (prevIndex >= 0) {
    result.push({
      item: items[prevIndex],
      index: prevIndex,
      position: "prev",
    });
  } else {
    result.push({
      item: null,
      index: -1,
      position: "empty",
    });
  }

  // العنصر الحالي دائماً في المنتصف
  result.push({
    item: items[currentIndex],
    index: currentIndex,
    position: "center",
  });

  // العنصر التالي أو مساحة فارغة
  if (nextIndex < items.length) {
    result.push({
      item: items[nextIndex],
      index: nextIndex,
      position: "next",
    });
  } else {
    result.push({
      item: null,
      index: -1,
      position: "empty",
    });
  }

  return result;
};

  // دالة للتنقل بين التواريخ
  const navigateDate = (direction: "prev" | "next") => {
    let newIndex = currentDateIndex;
    if (direction === "prev") {
      newIndex = Math.max(0, currentDateIndex - 1);
    } else {
      newIndex = Math.min(dates.length - 1, currentDateIndex + 1);
    }
    if (newIndex !== currentDateIndex) {
      setCurrentDateIndex(newIndex);
      onDateSelect(dates[newIndex], newIndex);
    }
  };

  // دالة للتنقل بين الأوقات
  const navigateTime = (direction: "prev" | "next") => {
    let newIndex = currentTimeIndex;
    if (direction === "prev") {
      newIndex = Math.max(0, currentTimeIndex - 1);
    } else {
      newIndex = Math.min(times.length - 1, currentTimeIndex + 1);
    }
    if (newIndex !== currentTimeIndex) {
      setCurrentTimeIndex(newIndex);
      onTimeSelect(times[newIndex], newIndex);
    }
  };

  // أحداث السحب للتاريخ
  const handleDateMouseDown = (e: React.MouseEvent) => {
    setIsDateDragging(true);
    setDateStartY(e.clientY);
    if (dateContainerRef.current) {
      dateContainerRef.current.style.cursor = "grabbing";
    }
  };

  const handleDateMouseMove = (e: React.MouseEvent) => {
    if (!isDateDragging) return;
    e.preventDefault();

    const deltaY = e.clientY - dateStartY;

    if (deltaY < -30) {
      navigateDate("next");
      setIsDateDragging(false);
      if (dateContainerRef.current) {
        dateContainerRef.current.style.cursor = "grab";
      }
    } else if (deltaY > 30) {
      navigateDate("prev");
      setIsDateDragging(false);
      if (dateContainerRef.current) {
        dateContainerRef.current.style.cursor = "grab";
      }
    }
  };

  const handleDateMouseUp = () => {
    setIsDateDragging(false);
    if (dateContainerRef.current) {
      dateContainerRef.current.style.cursor = "grab";
    }
  };

  const handleDateTouchStart = (e: React.TouchEvent) => {
    setIsDateDragging(true);
    setDateStartY(e.touches[0].clientY);
  };

  const handleDateTouchMove = (e: React.TouchEvent) => {
    if (!isDateDragging) return;
    e.preventDefault();

    const deltaY = e.touches[0].clientY - dateStartY;

    if (deltaY < -30) {
      navigateDate("next");
      setIsDateDragging(false);
    } else if (deltaY > 30) {
      navigateDate("prev");
      setIsDateDragging(false);
    }
  };

  const handleDateTouchEnd = () => {
    setIsDateDragging(false);
  };

  // أحداث السحب للوقت
  const handleTimeMouseDown = (e: React.MouseEvent) => {
    setIsTimeDragging(true);
    setTimeStartY(e.clientY);
    if (timeContainerRef.current) {
      timeContainerRef.current.style.cursor = "grabbing";
    }
  };

  const handleTimeMouseMove = (e: React.MouseEvent) => {
    if (!isTimeDragging) return;
    e.preventDefault();

    const deltaY = e.clientY - timeStartY;

    if (deltaY < -30) {
      navigateTime("next");
      setIsTimeDragging(false);
      if (timeContainerRef.current) {
        timeContainerRef.current.style.cursor = "grab";
      }
    } else if (deltaY > 30) {
      navigateTime("prev");
      setIsTimeDragging(false);
      if (timeContainerRef.current) {
        timeContainerRef.current.style.cursor = "grab";
      }
    }
  };

  const handleTimeMouseUp = () => {
    setIsTimeDragging(false);
    if (timeContainerRef.current) {
      timeContainerRef.current.style.cursor = "grab";
    }
  };

  const handleTimeTouchStart = (e: React.TouchEvent) => {
    setIsTimeDragging(true);
    setTimeStartY(e.touches[0].clientY);
  };

  const handleTimeTouchMove = (e: React.TouchEvent) => {
    if (!isTimeDragging) return;
    e.preventDefault();

    const deltaY = e.touches[0].clientY - timeStartY;

    if (deltaY < -30) {
      navigateTime("next");
      setIsTimeDragging(false);
    } else if (deltaY > 30) {
      navigateTime("prev");
      setIsTimeDragging(false);
    }
  };

  const handleTimeTouchEnd = () => {
    setIsTimeDragging(false);
  };

  const visibleDates = getVisibleItems(dates, currentDateIndex);
  const visibleTimes = getVisibleItems(times, currentTimeIndex);

  // دالة لعرض عنصر التاريخ
  const renderDateItem = (item: any, index: number, position: string) => {
    if (position === "empty") {
  return <div className="h-[32px] w-full" />;
}
    const isCenter = position === "center";

    return (
      <div
        key={`date-${index}-${position}`}
        className={cn(
          "shrink-0 px-2 py-1  text-center transition-all duration-300 cursor-pointer w-full",
          isCenter
            ? "scale-100 opacity-100 bg-[#E8F8FF8F]"
            : "scale-90 opacity-40 bg-transparent",
        )}
        onClick={() => {
          if (!isCenter) {
            setCurrentDateIndex(index);
            onDateSelect(item, index);
          }
        }}
      >
        <div className="flex items-center justify-center gap-1">
          <span
            className={cn(
              "font-medium whitespace-nowrap",
              isCenter ? "text-base text-gray-800" : "text-sm text-gray-400",
            )}
          >
            {format(item, "EEEE", { locale: ar })}
          </span>
          <span
            className={cn(
              "font-bold whitespace-nowrap",
              isCenter ? "text-base text-primary" : "text-sm text-gray-400",
            )}
          >
            {format(item, "dd-MM-yyyy")}
          </span>
        </div>
      </div>
    );
  };

  // دالة لعرض عنصر الوقت
  const renderTimeItem = (item: string, index: number, position: string) => {
    if (position === "empty") {
  return <div className="h-[32px] w-full" />;
}
    const isCenter = position === "center";
    const formattedTime = formatTime(item);

    return (
      <div
        key={`time-${index}-${position}`}
        className={cn(
          "shrink-0 px-2 py-1  text-center transition-all duration-300 cursor-pointer w-full",
          isCenter
            ? "scale-100 opacity-100 bg-[#E8F8FF8F]"
            : "scale-90 opacity-40 bg-transparent",
        )}
        onClick={() => {
          if (!isCenter) {
            setCurrentTimeIndex(index);
            onTimeSelect(item, index);
          }
        }}
      >
        <div className="flex items-center justify-center">
          <span
            className={cn(
              "font-bold whitespace-nowrap",
              isCenter ? "text-base text-primary" : "text-sm text-gray-400",
            )}
          >
            {formattedTime}
          </span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-4 rounded-xl">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (dates.length === 0 || times.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm rounded-xl">
        <p>لا توجد تواريخ أو أوقات متاحة</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden">
      <div className="grid grid-cols-2 h-25 relative">
        {/* عمود التاريخ */}
        <div
          ref={dateContainerRef}
          className="relative flex flex-col items-center justify-center gap-0.5 py-1 select-none touch-none"
          style={{
            cursor: "grab",
            minHeight: "100px",
          }}
          onMouseDown={handleDateMouseDown}
          onMouseMove={handleDateMouseMove}
          onMouseUp={handleDateMouseUp}
          onMouseLeave={handleDateMouseUp}
          onTouchStart={handleDateTouchStart}
          onTouchMove={handleDateTouchMove}
          onTouchEnd={handleDateTouchEnd}
        >
          {/* الخلفية الثابتة */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[32px] bg-[#E8F8FF8F] pointer-events-none z-0" />

          {/* العناصر */}
          <div className="relative z-10 w-full">
            {visibleDates.map((item) =>
              renderDateItem(item.item, item.index, item.position),
            )}
          </div>
        </div>

        {/* عمود الوقت */}
      <div
  ref={timeContainerRef}
  className="relative flex flex-col items-center justify-center gap-0.5 py-1 select-none touch-none"
  style={{
    cursor: "grab",
    minHeight: "100px",
  }}
  onMouseDown={handleTimeMouseDown}
  onMouseMove={handleTimeMouseMove}
  onMouseUp={handleTimeMouseUp}
  onMouseLeave={handleTimeMouseUp}
  onTouchStart={handleTimeTouchStart}
  onTouchMove={handleTimeTouchMove}
  onTouchEnd={handleTimeTouchEnd}
>
  {/* الخلفية الثابتة */}
  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[32px] bg-[#E8F8FF8F] pointer-events-none z-0" />

  {/* العناصر */}
  <div className="relative z-10 w-full">
    {visibleTimes.map((item) =>
      renderTimeItem(item.item, item.index, item.position)
    )}
  </div>
</div>
      </div>
    </div>
  );
}
