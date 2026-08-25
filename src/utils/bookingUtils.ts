// src/utils/bookingUtils.ts
import { BookingData } from '@/src/types/booking';

// ============================================
// BUSINESS LOGIC
// ============================================

export const calculateBookingTotal = (
  pricePerDay: number,
  rentalDays: number,
  services: { id: string; price: number }[],
  selectedServiceIds: string[]
): { subtotal: number; servicesTotal: number; tax: number; total: number } => {
  
  const carTotal = pricePerDay * rentalDays;
  
  const servicesTotal = services
    .filter(s => selectedServiceIds.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);
  
  const subtotal = carTotal + servicesTotal;
  const tax = 0; 
  const total = subtotal + tax;

  return { subtotal, servicesTotal, tax, total };
};

export const formatCurrency = (amount: number): string => {
  return `${amount} ريال`;
};

export const getInitialBookingData = (carId: string): Partial<BookingData> => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  return {
    customerName: '',
    customerPhone: '',
    rentalDate: dateStr,
    rentalTime: '16:00',
    rentalDays: 1,
    pickupLocation: 'جدة، السعودية',
    pickupAddress: '',
    selectedServices: [],
    selectedPaymentMethod: '',
    licenseFile: null,
    licenseFileName: '',
  };
};

export const validateBookingData = (data: BookingData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.customerName || data.customerName.trim().length < 3) {
    errors.customerName = 'الاسم مطلوب (3 أحرف على الأقل)';
  }

  if (!data.customerPhone) {
    errors.customerPhone = 'رقم الجوال مطلوب';
  }

  if (!data.rentalDate) {
    errors.rentalDate = 'تاريخ الاستلام مطلوب';
  }

  if (!data.rentalTime) {
    errors.rentalTime = 'وقت الاستلام مطلوب';
  }

  if (data.rentalDays < 1) {
    errors.rentalDays = 'عدد الأيام يجب أن يكون أكبر من 0';
  }

  if (!data.selectedPaymentMethod) {
    errors.selectedPaymentMethod = 'يرجى اختيار طريقة الدفع';
  }

  return errors;
};

// ============================================
// MONTHLY BOOKING HELPERS
// ============================================

export interface AvailableMonth {
  month: string;
  month_name: string;
  year: number;
  is_available: boolean;
  available_periods: AvailablePeriod[];
}

export interface AvailablePeriod {
  id: number;
  label: string;
  days_count: number;
  price_total: number;
  discount: number;
  final_price: number;
}

export interface AvailablePeriodsResponse {
  type: string;
  available_dates: any[] | null;
  available_months: AvailableMonth[];
  available_years: any[] | null;
  working_hours: any[] | null;
  min_advance_booking_hours: any;
  max_advance_booking_days: any;
  min_advance_booking_days: number;
  max_advance_booking_months: number;
  max_advance_booking_years: any;
}

/**
 * التحقق مما إذا كانت الفترة متاحة (شهرية)
 */
export const isMonthlyPeriodAvailable = (month: AvailableMonth): boolean => {
  return month.is_available && month.available_periods.length > 0;
};

/**
 * الحصول على الأشهر المتاحة من الـ Response
 */
export const getAvailableMonths = (response: AvailablePeriodsResponse): AvailableMonth[] => {
  if (!response || !response.available_months) {
    return [];
  }
  return response.available_months.filter(month => isMonthlyPeriodAvailable(month));
};

/**
 * الحصول على أول شهر متاح
 */
export const getFirstAvailableMonth = (response: AvailablePeriodsResponse): AvailableMonth | null => {
  const availableMonths = getAvailableMonths(response);
  return availableMonths.length > 0 ? availableMonths[0] : null;
};

/**
 * تنسيق تاريخ الشهر للعرض
 */
export const formatMonthDisplay = (month: AvailableMonth): string => {
  return `${month.month_name} ${month.year}`;
};

/**
 * الحصول على أقل سعر شهر متاح
 */
export const getCheapestMonthlyPrice = (response: AvailablePeriodsResponse): number => {
  const availableMonths = getAvailableMonths(response);
  if (availableMonths.length === 0) return 0;
  
  let minPrice = Infinity;
  availableMonths.forEach(month => {
    month.available_periods.forEach(period => {
      if (period.final_price < minPrice) {
        minPrice = period.final_price;
      }
    });
  });
  
  return minPrice === Infinity ? 0 : minPrice;
};

/**
 * التحقق مما إذا كانت هناك أشهر متاحة
 */
export const hasAvailableMonths = (response: AvailablePeriodsResponse): boolean => {
  return getAvailableMonths(response).length > 0;
};