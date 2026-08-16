import { Car } from '@/src/types/booking';

// ============================================
// MOCK CAR DATA
// ============================================

export const mockCar: Car = {
  id: 'car-001',
  name: 'MG ZS',
  brand: 'MG',
  model: 'ZS',
  year: 2023,
  pricePerDay: 115,
  pricePerMonth: 2800,
  image: '/images/cars/car2.png',
  images: ['/images/cars/car2.png', '/images/cars/car1.png', '/images/cars/car1.png'],
  fuelType: 'بنزين',
  transmission: 'أوتوماتيك',
  seats: 5,
  doors: 4,
  category: 'SUV',
  color: 'أبيض',
  mileage: 15000,
  rating: 4.8,
  reviewsCount: 124,
  description: 'سيارة MG ZS موديل 2023، SUV عملية ومريحة مع تصميم عصري ومحرك اقتصادي.',
  specifications: {
    engine: '1.5 لتر 4 سلندر',
    horsepower: '120 حصان',
    torque: '150 نيوتن متر',
    acceleration: '0-100 في 12.5 ثانية',
    topSpeed: '170 كم/ساعة',
    fuelConsumption: '6.5 لتر/100 كم',
    driveType: 'دفع أمامي',
  },
  features: [
    'مكيف هواء',
    '5 مقاعد',
    'نظام صوت 4 سماعات',
    'شاشة 8 بوصة',
    'Apple CarPlay',
    'Android Auto',
    'كاميرا خلفية',
    'حساسات ركن',
  ],
  isAvailable: true,
  availableFrom: '2026-01-01',
  availableTo: '2026-12-31',
  insurance: {
    type: 'تأمين شامل',
    coverage: 'تغطية كاملة ضد الحوادث والسرقة',
    excess: 1000,
  },
  location: {
    city: 'الرياض',
    address: 'طريق الملك فهد، حي العليا',
    coordinates: {
      lat: 24.7136,
      lng: 46.6753,
    },
  },
  owner: {
    id: 'owner-001',
    name: 'شركة تأجير السيارات الأولى',
    phone: '+966 50 000 0000',
    email: 'info@carrent.com',
    rating: 4.9,
  },
  // ✅ شروط ومزايا التأجير
  terms: {
    conditions: [
      'العمر 25 سنة وأكثر',
      'رخصة قيادة سارية المفعول',
      'التأجير والتوصيل في مدينة الرياض فقط',
      'مبلغ مسترد 1000 ريال يعاد بعد التسليم',
      'العملاء السابقين لا يشترط دفع مبلغ مسترد',
    ],
    advantages: [
      'موديل 2023',
      'تأمين شامل مع قيمة تحمل',
      'الصيانة الدورية والزيت والغسيل مجانا',
      'الفحص وصيانة الوكالة مجانا',
      'توصيل السيارة لموقعك مجانا بنفس اليوم',
      'أقل مدة للتأجير مع خدمة التوصيل (2 أيام)',
      'مكيف هواء',
      '5 مقاعد',
    ],
  },
};