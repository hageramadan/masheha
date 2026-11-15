"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useBookingForm } from '@/src/hooks/useBookingForm';
import { useBookingIdentity } from '@/src/hooks/useBookingIdentity';
import { useBookingSchedule } from '@/src/hooks/useBookingSchedule';
import CarDetails from './CarDetails';
import BookingServices from './BookingServices';
import BookingPayment from './BookingPayment';
import BookingSummary from './BookingSummary';
import BookingCustomerInfo from './BookingCustomerInfo';
import BookingRentalSchedule from './BookingRentalSchedule';
import BookingPickupLocation from './BookingPickupLocation';
import BookingSubmitButton from './BookingSubmitButton';
import GoogleMapPicker from './GoogleMapPicker';
import DownloadSection2 from '../home/downloadSection2';
import Download3 from '../home/download3';

interface BookingFormProps {
  carId: string;
  car: any;
  services: any[];
  periods?: any[];
  rentalType?: "يومي" | "شهري";
}

export default function BookingForm({
  carId,
  car,
  services,
  periods = [],
  rentalType = "يومي",
}: BookingFormProps) {
  const rentalCompanyId = car?.providerId || car?.office?.id;
  const bookingType = rentalType === "يومي" ? "daily" : "monthly";

  // ✅ استخرج الفترات الشهرية الفريدة من periods prop
  const monthlyPeriodsFromProps = useMemo(() => {
    if (!periods || periods.length === 0) return [];

    const unique = new Map<number, any>();
    periods.forEach((p: any) => {
      if (p?.id && !unique.has(p.id)) {
        unique.set(p.id, {
          id: p.id,
          days_count: p.days_count,
          final_price: p.final_price || p.price_total,
          label: p.label,
        });
      }
    });
    return Array.from(unique.values());
  }, [periods]);

  const {
    bookingData,
    errors,
    isSubmitting,
    isRedirecting,
    totals,
    availableServices,
    isCalculating,
    updateField,
    toggleService,
    submit,
    setPeriodId,
    validateMonthlyPeriod,
    monthlyPeriods,
    setAvailableMonthsData,
  } = useBookingForm(
    carId,
    car?.pricePerDay || 0,
    services,
    rentalCompanyId,
    bookingType,
    car?.name || "سياره",
    monthlyPeriodsFromProps,
  );

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const minimumDays = car?.minimumDays || car?.minimum_days || 1;
  const identity = useBookingIdentity({ bookingData, updateField });
  const {
    isIdentityVerified,
    isVerifying,
    isOTPLoading,
  } = identity;
  const schedule = useBookingSchedule({
    carId,
    rentalCompanyId,
    bookingType,
    minimumDays,
    bookingData,
    updateField,
    setPeriodId,
    validateMonthlyPeriod,
    monthlyPeriods,
    setAvailableMonthsData,
  });
  const {
    selectedPeriod,
  } = schedule;

  // دالة التحقق من صحة النموذج بالكامل
  const validateForm = useCallback(() => {
    const name = bookingData.customerName?.trim();
    const phone = bookingData.customerPhone?.trim();
    const rentalDate = bookingData.rentalDate;
    const rentalTime = bookingData.rentalTime;
    const rentalDays = bookingData.rentalDays;
    const paymentMethod = bookingData.selectedPaymentMethod;

    if (!name) {
      toast.error("يرجى إدخال الاسم");
      return false;
    }

    if (!phone) {
      toast.error("يرجى إدخال رقم الجوال");
      return false;
    }

    if (!rentalDate) {
      toast.error("يرجى اختيار تاريخ الاستلام");
      return false;
    }

    if (!rentalTime) {
      toast.error("يرجى اختيار وقت الاستلام");
      return false;
    }

    if (bookingType === "daily" && (!rentalDays || rentalDays < minimumDays)) {
      toast.error(`الحد الأدنى للحجز هو ${minimumDays} أيام`);
      return false;
    }

    if (bookingType === "monthly" && !selectedPeriod) {
      toast.error("يرجى اختيار فترة الحجز");
      return false;
    }

    if (!selectedAddress) {
      toast.error("يرجى تحديد موقع الاستلام على الخريطة");
      return false;
    }

    if (!paymentMethod) {
      toast.error("يرجى اختيار طريقة الدفع");
      return false;
    }

    return true;
  }, [bookingData, bookingType, minimumDays, selectedAddress, selectedPeriod]);

  // معالج الضغط على زر الحجز
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isIdentityVerified) {
      toast.error("يرجى التحقق من هويتك أولاً");
      return;
    }

    if (!validateForm()) return;

    await submit();
  };

  const handleLocationSelect = async (
    lat: number,
    lng: number,
    address: string,
  ) => {
    setSelectedAddress(address);
    updateField(
      "pickupLocation",
      address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    );
    updateField(
      "pickupAddress",
      address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    );
    updateField("pickupLat", lat);
    updateField("pickupLng", lng);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-2">
          <CarDetails car={car} rentalType={rentalType} />
        </div>

        <div className="lg:col-span-1 ">
          <DownloadSection2 />
          <form onSubmit={handleSubmit} className="space-y-8 mb-4">
            <BookingCustomerInfo
              bookingData={bookingData}
              errors={errors}
              updateField={updateField}
              identity={identity}
            />

            <BookingRentalSchedule
              bookingData={bookingData}
              errors={errors}
              updateField={updateField}
              bookingType={bookingType}
              minimumDays={minimumDays}
              schedule={schedule}
            />

            <BookingPickupLocation
              selectedAddress={selectedAddress}
              onOpenMap={() => setIsMapOpen(true)}
            />
          </form>
          <BookingServices
            services={availableServices}
            selectedServices={bookingData.selectedServices}
            onToggle={toggleService}
          />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <BookingSummary
            car={car}
            rentalDays={bookingData.rentalDays}
            totals={totals}
            deliveryFee={20}
            isCalculating={isCalculating}
          />

          <BookingPayment
            selectedMethod={bookingData.selectedPaymentMethod}
            onSelect={(id) => updateField("selectedPaymentMethod", id)}
            error={errors.selectedPaymentMethod}
            rentalType={rentalType}
          />

          <BookingSubmitButton
            isSubmitting={isSubmitting}
            isCalculating={isCalculating}
            isRedirecting={isRedirecting}
            isOTPLoading={isOTPLoading}
            isVerifying={isVerifying}
            isIdentityVerified={isIdentityVerified}
            onSubmit={handleSubmit}
          />

          <Download3 />
        </div>

        <GoogleMapPicker
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          onLocationSelect={handleLocationSelect}
          initialPosition={{ lat: 24.7136, lng: 46.6753 }}
        />
      </div>

    </>
  );
}
