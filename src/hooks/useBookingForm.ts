'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { BookingData, AdditionalService } from '@/src/types/booking';
import { 
  calculateBookingTotal, 
  validateBookingData, 
  getInitialBookingData 
} from '@/src/utils/bookingUtils';
import { BookingService } from '@/src/services/bookingService';
import { toast } from 'sonner';

export const useBookingForm = (carId: string, carPricePerDay: number) => {
  const [bookingData, setBookingData] = useState<BookingData>(() => ({
    ...getInitialBookingData(carId),
    customerName: '',
    customerPhone: '',
  } as BookingData));
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableServices, setAvailableServices] = useState<AdditionalService[]>([]);

  // ---- Load Services ----
  useEffect(() => {
    BookingService.getServices().then(setAvailableServices);
  }, []);

  // ---- Calculate Total ----
  const totals = useMemo(() => {
    return calculateBookingTotal(
      carPricePerDay,
      bookingData.rentalDays || 0,
      availableServices,
      bookingData.selectedServices || []
    );
  }, [carPricePerDay, bookingData.rentalDays, availableServices, bookingData.selectedServices]);

  // ---- Update Field ----
  const updateField = useCallback(<K extends keyof BookingData>(
    field: K,
    value: BookingData[K]
  ) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  // ---- Toggle Service ----
  const toggleService = useCallback((serviceId: string) => {
    setBookingData(prev => {
      const selected = prev.selectedServices || [];
      const newSelected = selected.includes(serviceId)
        ? selected.filter(id => id !== serviceId)
        : [...selected, serviceId];
      return { ...prev, selectedServices: newSelected };
    });
  }, []);

  // ---- File Upload ----
  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) {
      updateField('licenseFile', null);
      updateField('licenseFileName', '');
      return;
    }

    const validation = BookingService.validateLicenseFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'الملف غير صالح');
      return;
    }

    updateField('licenseFile', file);
    updateField('licenseFileName', file.name);
    toast.success('تم رفع الملف بنجاح');
  }, [updateField]);

  // ---- Validate Form ----
  const validate = useCallback(() => {
    const newErrors = validateBookingData(bookingData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [bookingData]);

  // ---- Submit ----
  const submit = useCallback(async () => {
    if (!validate()) {
      toast.error('⚠️ يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await BookingService.submitBooking(bookingData);
      
      if (result.success) {
        toast.success(result.message || 'تم الحجز بنجاح! 🎉');
        return result;
      } else {
        toast.error(result.message || 'حدث خطأ أثناء الحجز');
        return null;
      }
    } catch (error) {
      toast.error('حدث خطأ غير متوقع');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingData, validate]);

  return {
    bookingData,
    errors,
    isSubmitting,
    totals,
    availableServices,
    updateField,
    toggleService,
    handleFileSelect,
    validate,
    submit,
  };
};