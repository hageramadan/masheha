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
  const tax = 0; // 0 ريال حالياً
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
    rentalDate: dateStr,
    rentalTime: '09:00',
    rentalDays: 4,
    pickupLocation: 'جدة، السعودية',
    pickupAddress: '',
    selectedServices: [],
    selectedPaymentMethod: null,
    licenseFile: null,
    licenseFileName: '',
  };
};

export const validateBookingData = (data: BookingData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.customerName || data.customerName.trim().length < 3) {
    errors.customerName = 'الاسم مطلوب (3 أحرف على الأقل)';
  }

  if (!data.customerPhone || data.customerPhone.trim().length < 10) {
    errors.customerPhone = 'رقم الجوال مطلوب (10 أرقام على الأقل)';
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

  if (!data.pickupLocation || data.pickupLocation.trim().length < 3) {
    errors.pickupLocation = 'موقع الاستلام مطلوب';
  }

  if (!data.licenseFile) {
    errors.licenseFile = 'رخصة القيادة مطلوبة';
  }

  if (!data.selectedPaymentMethod) {
    errors.selectedPaymentMethod = 'يرجى اختيار طريقة الدفع';
  }

  return errors;
};