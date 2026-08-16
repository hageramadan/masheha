import { AdditionalService, PaymentMethod } from '@/src/types/booking';

export const mockServices: AdditionalService[] = [
  {
    id: 'srv-001',
    name: 'توصيل السيارة إلى مكانك',
    description: 'نوصل السيارة إلى عنوانك المفضل',
    price: 115,
  },
  {
    id: 'srv-002',
    name: 'كرسي الأطفال',
    description: 'كرسي أطفال آمن ومريح',
    price: 115,
  },
  {
    id: 'srv-003',
    name: 'سائق إضافي',
    description: 'إضافة سائق إضافي للتوصيل',
    price: 115,
  },
  {
    id: 'srv-004',
    name: 'سيارات لغير المدخنين',
    description: 'سيارة مخصصة لغير المدخنين',
    price: 115,
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pay-001', name: 'فيزا / ماستر', icon: 'FaCreditCard', isAvailable: true },
  { id: 'pay-002', name: 'مدى', icon: 'FaMoneyBill', isAvailable: true },
  { id: 'pay-003', name: 'Apple Pay', icon: 'FaApple', isAvailable: true },
  { id: 'pay-004', name: 'تابي', icon: 'FaTag', isAvailable: true },
  { id: 'pay-005', name: 'تمارا', icon: 'FaStar', isAvailable: true },
];

export const mockAvailableDates = [
  { date: '2026-06-06', label: 'اليوم' },
  { date: '2026-06-07', label: 'غداً' },
  { date: '2026-06-08', label: 'السبت' },
  { date: '2026-06-09', label: 'الأحد' },
];

export const mockAvailableTimes = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
];