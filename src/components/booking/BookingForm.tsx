"use client";

import { useBookingForm } from "@/src/hooks/useBookingForm";
import CarDetails from "./CarDetails";
import BookingServices from "./BookingServices";
import BookingPayment from "./BookingPayment";
import BookingLicenseUpload from "./BookingLicenseUpload";
import BookingSummary from "./BookingSummary";
import { mockCar } from "@/src/data/mock/mockCar";
import {
  mockAvailableDates,
  mockAvailableTimes,
} from "@/src/data/mock/mockServices";
import {
  FaLocationDot,
} from "react-icons/fa6";
import PhoneInput from "../contact/PhoneInput";
import { useState } from "react";
import { format, setHours, setMinutes } from "date-fns";
import { ar } from "date-fns/locale";

// مكونات shadcn/ui
import { Calendar } from "@/src/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/select";
import { Button } from "@/src/ui/button";
import { cn } from "@/src/lib/utils";

// مكون الخريطة - سنستخدم react-leaflet
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

// إصلاح أيقونة Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface BookingFormProps {
  carId: string;
}

// مكون لالتقاط النقرات على الخريطة
function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function BookingForm({ carId }: BookingFormProps) {
  const {
    bookingData,
    errors,
    isSubmitting,
    totals,
    availableServices,
    updateField,
    toggleService,
    handleFileSelect,
    submit,
  } = useBookingForm(carId, mockCar.pricePerDay);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);

  const handlePhoneChange = (phone: string, code: string) => {
    setPhoneNumber(phone);
    setCountryCode(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  // توليد أوقات بنظام 12 ساعة كل 30 دقيقة من 9 صباحاً إلى 5 مساءً
  const generateTimeOptions = () => {
    const times = [];
    for (let i = 9; i <= 17; i++) {
      for (let j = 0; j < 60; j += 30) {
        if (i === 17 && j > 0) break;
        const hour = i % 12 || 12;
        const minute = j === 0 ? "00" : j;
        const period = i >= 12 ? "مساءً" : "صباحاً";
        times.push(`${hour}:${minute} ${period}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // زيادة عدد الأيام
  const incrementDays = () => {
    updateField("rentalDays", (bookingData.rentalDays || 1) + 1);
  };

  // نقصان عدد الأيام
  const decrementDays = () => {
    if ((bookingData.rentalDays || 1) > 1) {
      updateField("rentalDays", (bookingData.rentalDays || 1) - 1);
    }
  };

  // التعامل مع تغيير عدد الأيام يدوياً
  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && !isNaN(value)) {
      updateField("rentalDays", value);
    } else if (e.target.value === "") {
      // السماح بحقل فارغ مؤقتاً
    }
  };

  // تحويل التاريخ إلى نص
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy", { locale: ar });
  };

  // تحديث الموقع عند النقر على الخريطة
  const handleLocationSelect = (lat: number, lng: number) => {
    setMapPosition([lat, lng]);
    // هنا يمكنك تحديث الحقول أو استدعاء API للحصول على العنوان
    updateField("pickupLocation", `موقع محدد (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
    updateField("pickupAddress", `خط العرض: ${lat.toFixed(6)}, خط الطول: ${lng.toFixed(6)}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ✅ العمود الأول - بيانات العميل والتاريخ والموقع */}
      <div className="lg:col-span-2">
        {/* Car Details */}
        <CarDetails car={mockCar} />
      </div>

      <div className="lg:col-span-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Info */}
          <div className="bg-white space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                الاسم *
              </label>
              <input
                type="text"
                value={bookingData.customerName}
                onChange={(e) => updateField("customerName", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.customerName
                    ? "border-red-500"
                    : "border-gray-200 focus:border-primary"
                }`}
                placeholder="محمد مصطفى"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                رقم الجوال *
              </label>
              <PhoneInput
                value={phoneNumber}
                onChange={handlePhoneChange}
                required={true}
              />
              {errors.customerPhone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerPhone}
                </p>
              )}
            </div>
          </div>

          {/* Date & Time with Calendar and Counter */}
          <div className="bg-white space-y-4">
            {/* حقل التاريخ مع التقويم المنبثق */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                تاريخ الاستلام *
              </label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger className="w-full">
                  <div
                    style={{ width: "100%" }}
                    className={cn(
                      "flex justify-between text-right font-normal px-4 py-3 h-auto border-2 rounded-xl",
                      !bookingData.rentalDate && "text-muted-foreground",
                      errors.rentalDate
                        ? "border-red-500"
                        : "border-gray-200 hover:border-primary/50",
                    )}
                  >
                    <FaCalendarAlt className="ml-2 h-4 w-4 text-primary" />
                    {bookingData.rentalDate ? (
                      formatDate(new Date(bookingData.rentalDate))
                    ) : (
                      <span>اختر تاريخ الاستلام</span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                  sideOffset={4}
                >
                  <Calendar
                    mode="single"
                    selected={
                      bookingData.rentalDate
                        ? new Date(bookingData.rentalDate)
                        : undefined
                    }
                    onSelect={(date: Date | undefined) => {
                      if (date) {
                        updateField(
                          "rentalDate",
                          date.toISOString().split("T")[0],
                        );
                        setIsCalendarOpen(false);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    className="rounded-xl"
                    locale={ar}
                  />
                </PopoverContent>
              </Popover>
              {errors.rentalDate && (
                <p className="text-red-500 text-sm mt-1">{errors.rentalDate}</p>
              )}
            </div>

            {/* حقل الوقت مع Select */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                وقت الاستلام *
              </label>
              <Select
                value={bookingData.rentalTime || ""}
                onValueChange={(value) =>
                  updateField("rentalTime", value || "")
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-full px-4 py-6 h-auto border-2 rounded-xl focus:ring-0 focus:ring-offset-0",
                    errors.rentalTime
                      ? "border-red-500"
                      : "border-gray-200 focus:border-primary",
                  )}
                >
                  <SelectValue placeholder="اختر وقت الاستلام" />
                </SelectTrigger>
                <SelectContent
                  className="max-h-80"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rentalTime && (
                <p className="text-red-500 text-sm mt-1">{errors.rentalTime}</p>
              )}
            </div>

            {/* عداد الأيام */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                عدد أيام الحجز *
              </label>
              <div className="flex items-center gap-2">
                <p className="text-gray-500 text-sm">
                  {bookingData.rentalDays || 1} أيام
                </p>
                <div className="flex items-center border-2 rounded-xl overflow-hidden w-fit border-gray-200 focus-within:border-primary transition-colors">
                  <button
                    type="button"
                    onClick={decrementDays}
                    disabled={(bookingData.rentalDays || 1) <= 1}
                    className={cn(
                      "w-12 h-12 flex items-center justify-center text-xl font-bold transition-colors",
                      (bookingData.rentalDays || 1) <= 1
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700",
                    )}
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="1"
                    value={bookingData.rentalDays}
                    onChange={handleDaysChange}
                    onBlur={() => {
                      if (
                        !bookingData.rentalDays ||
                        bookingData.rentalDays < 1
                      ) {
                        updateField("rentalDays", 1);
                      }
                    }}
                    className={cn(
                      "w-16 h-12 px-2 text-center text-gray-800 text-lg font-bold border-0 focus:outline-none focus:ring-0",
                      errors.rentalDays && "border-red-500",
                    )}
                  />

                  <button
                    type="button"
                    onClick={incrementDays}
                    className="w-12 h-12 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 flex items-center justify-center text-xl font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              {errors.rentalDays && (
                <p className="text-red-500 text-sm mt-2">{errors.rentalDays}</p>
              )}
            </div>
          </div>

          {/* Location with Map */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                <FaMapMarkerAlt className="inline ml-1 text-primary" />
                موقع الاستلام
              </h2>
              <button
                type="button"
                onClick={() => setIsMapOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
              >
                <FaLocationDot className="h-4 w-4" />
                حدد الموقع على الخريطة
              </button>
            </div>

            <div>
              <input
                type="text"
                value={bookingData.pickupLocation}
                onChange={(e) => updateField("pickupLocation", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.pickupLocation
                    ? "border-red-500"
                    : "border-gray-200 focus:border-primary"
                }`}
                placeholder="المدينة، الحي"
              />
              {errors.pickupLocation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pickupLocation}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                value={bookingData.pickupAddress}
                onChange={(e) => updateField("pickupAddress", e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                placeholder="العنوان التفصيلي"
              />
            </div>

            {/* عرض الإحداثيات إذا تم تحديدها */}
            {mapPosition && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                <span className="font-medium">الموقع المحدد:</span>{" "}
                {mapPosition[0].toFixed(6)}, {mapPosition[1].toFixed(6)}
              </div>
            )}
          </div>

          {/* License Upload */}
          <BookingLicenseUpload
            onFileSelect={handleFileSelect}
            fileName={bookingData.licenseFileName}
            error={errors.licenseFile}
          />
        </form>
      </div>

      {/* ✅ العمود الثاني */}
      <div className="lg:col-span-1 space-y-6">
        <BookingServices
          services={availableServices}
          selectedServices={bookingData.selectedServices}
          onToggle={toggleService}
        />

        <BookingSummary
          car={mockCar}
          rentalDays={bookingData.rentalDays}
          totals={totals}
        />

        <BookingPayment
          selectedMethod={bookingData.selectedPaymentMethod}
          onSelect={(id) => updateField("selectedPaymentMethod", id)}
          error={errors.selectedPaymentMethod}
        />

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              جاري الحجز...
            </span>
          ) : (
            "احجز الآن"
          )}
        </button>
      </div>

      {/* Modal الخريطة */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                <FaMapMarkerAlt className="inline ml-2 text-primary" />
                اختر موقع الاستلام
              </h3>
              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="h-[500px] w-full rounded-xl overflow-hidden">
                <MapContainer
                  center={[24.7136, 46.6753]} // الرياض كموقع افتراضي
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker onLocationSelect={handleLocationSelect} />
                </MapContainer>
              </div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                انقر على الخريطة لتحديد موقع الاستلام
              </div>
              {mapPosition && (
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setIsMapOpen(false)}
                    className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    تأكيد الموقع
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}