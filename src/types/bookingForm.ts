import type { useBookingForm } from '@/src/hooks/useBookingForm';

export type BookingFormController = ReturnType<typeof useBookingForm>;
export type BookingType = 'daily' | 'monthly';
