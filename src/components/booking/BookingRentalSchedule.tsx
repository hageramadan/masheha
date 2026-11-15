'use client';

import toast from 'react-hot-toast';
import DateTimeSlider from './DateTimeSlider';
import { cn } from '@/src/lib/utils';
import type { useBookingSchedule } from '@/src/hooks/useBookingSchedule';
import type { BookingFormController, BookingType } from '@/src/types/bookingForm';

type BookingRentalScheduleProps = Pick<BookingFormController, 'bookingData' | 'errors' | 'updateField'> & {
  bookingType: BookingType;
  minimumDays: number;
  schedule: ReturnType<typeof useBookingSchedule>;
};

export default function BookingRentalSchedule({
  bookingData,
  errors,
  updateField,
  bookingType,
  minimumDays,
  schedule,
}: BookingRentalScheduleProps) {
  const {
    availableDateList,
    availableTimeList,
    selectedDateIndex,
    selectedTimeIndex,
    setSelectedDateIndex,
    setSelectedTimeIndex,
    monthlyDateList,
    monthlyTimeList,
    selectedMonthlyDateIndex,
    selectedMonthlyTimeIndex,
    setSelectedMonthlyDateIndex,
    setSelectedMonthlyTimeIndex,
    rentalMonths,
    setRentalMonths,
    isLoadingPeriods,
    formatTimeTo12Hour,
    handleDateSelect,
    handleMonthlyDateSelect,
    handleTimeSelect,
    incrementDays,
    decrementDays,
    handleDaysChange,
    incrementMonths,
    decrementMonths,
    handleMonthsChange,
  } = schedule;
  return (
    <div className="bg-[#FCF9F466] space-y-4 border rounded-lg p-3 lg:p-5">
      <div>
        <label className="block font-semibold text-sm text-[#1F2937] mb-2">
          تاريخ ووقت التوصيل *
        </label>

        {bookingType === "daily" ? (
          <DateTimeSlider
            dates={availableDateList}
            times={availableTimeList}
            selectedDateIndex={selectedDateIndex}
            selectedTimeIndex={selectedTimeIndex}
            onDateSelect={(date, index) => {
              setSelectedDateIndex(index);
              handleDateSelect(date);
            }}
            onTimeSelect={(time, index) => {
              setSelectedTimeIndex(index);
              handleTimeSelect(time);
            }}
            formatTime={formatTimeTo12Hour}
            isLoading={isLoadingPeriods}
          />
        ) : (
          <DateTimeSlider
            dates={monthlyDateList}
            times={monthlyTimeList}
            selectedDateIndex={selectedMonthlyDateIndex}
            selectedTimeIndex={selectedMonthlyTimeIndex}
            onDateSelect={(date, index) => {
              setSelectedMonthlyDateIndex(index);
              handleMonthlyDateSelect(date);
            }}
            onTimeSelect={(time, index) => {
              setSelectedMonthlyTimeIndex(index);
              updateField("rentalTime", time);
            }}
            formatTime={formatTimeTo12Hour}
            isLoading={isLoadingPeriods}
          />
        )}

        {errors.rentalDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.rentalDate}
          </p>
        )}

        {errors.rentalTime && (
          <p className="text-red-500 text-sm mt-1">
            {errors.rentalTime}
          </p>
        )}
      </div>

      {/* عدد الأيام للحجز اليومي */}
      {bookingType === "daily" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-[#1F2937] mb-2">
              عدد أيام الحجز *
            </label>
            <p className="text-gray-500 text-sm">
              {bookingData.rentalDays || minimumDays} أيام
            </p>
          </div>
          <div className="flex items-center gap-2 mx-auto">
            <div className="flex items-center border-2 mx-auto rounded-xl overflow-hidden w-[90%] border-gray-200 focus-within:border-primary transition-colors">
              <button
                type="button"
                onClick={incrementDays}
                className="w-12 lg:w-16 h-12 bg-primary border-2 border-[var(--primary)] text-gray-100 hover:bg-gray-800 flex items-center justify-center text-xl font-bold transition-colors"
              >
                +
              </button>

              <input
                type="number"
                min={minimumDays}
                value={bookingData.rentalDays || minimumDays}
                onChange={handleDaysChange}
                onBlur={() => {
                  if (
                    !bookingData.rentalDays ||
                    bookingData.rentalDays < minimumDays
                  ) {
                    updateField("rentalDays", minimumDays);
                    toast.error(
                      `الحد الأدنى للحجز هو ${minimumDays} أيام`,
                    );
                  }
                }}
                className={cn(
                  "w-full h-12 px-2 text-center text-gray-800 text-lg font-bold border-0 focus:outline-none focus:ring-0",
                  errors.rentalDays && "border-red-500",
                )}
              />

              <button
                type="button"
                onClick={decrementDays}
                className={cn(
                  "w-12 lg:w-16 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                  (bookingData.rentalDays || minimumDays) <= minimumDays
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1F2937]",
                )}
              >
                -
              </button>
            </div>
          </div>
          {errors.rentalDays && (
            <p className="text-red-500 text-sm mt-2">
              {errors.rentalDays}
            </p>
          )}
        </div>
      )}

      {/* ✅ عدد الأشهر للحجز الشهري */}
      {bookingType === "monthly" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-[#1F2937] mb-2">
              عدد أشهر الحجز *
            </label>
            <p className="text-gray-500 text-sm">
              {rentalMonths} {rentalMonths === 1 ? "شهر" : "أشهر"}
            </p>
          </div>
          <div className="flex items-center gap-2 mx-auto">
            <div className="flex items-center border-2 mx-auto rounded-xl overflow-hidden w-[90%] border-gray-200 focus-within:border-primary transition-colors">
              <button
                type="button"
                onClick={incrementMonths}
                className="w-12 lg:w-16 h-12 bg-primary border-2 border-[var(--primary)] text-gray-100 hover:bg-gray-800 flex items-center justify-center text-xl font-bold transition-colors"
              >
                +
              </button>

              <input
                type="number"
                min={1}
                value={rentalMonths}
                onChange={handleMonthsChange}
                onBlur={() => {
                  if (!rentalMonths || rentalMonths < 1) {
                    setRentalMonths(1);
                    toast.error("الحد الأدنى للحجز هو شهر واحد");
                  }
                }}
                className={cn(
                  "w-full h-12 px-2 text-center text-gray-800 text-lg font-bold border-0 focus:outline-none focus:ring-0",
                  errors.rentalDays && "border-red-500",
                )}
              />

              <button
                type="button"
                onClick={decrementMonths}
                className={cn(
                  "w-12 lg:w-16 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                  (rentalMonths || 1) <= 1
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#1F2937]",
                )}
              >
                -
              </button>
            </div>
          </div>
          {errors.rentalDays && (
            <p className="text-red-500 text-sm mt-2">
              {errors.rentalDays}
            </p>
          )}
        </div>
      )}
    </div>

  );
}
