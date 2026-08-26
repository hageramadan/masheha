// ============================================
// TYPES
// ============================================
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  pricePerMonth?: number;
  image: string;
  images?: string[];
  fuelType: 'بنزين' | 'ديزل' | 'كهربائي' | 'هايبرد';
  transmission: 'أوتوماتيك' | 'يدوي';
  seats: number;
  doors?: number;
  category: 'SUV' | 'سيدان' | 'كوبيه' | 'شاحنة' | 'فان' | 'رياضية';
  color: string;
  mileage?: number;
  rating?: number;
  reviewsCount?: number;
  description?: string;
  specifications?: {
    engine: string;
    horsepower: string;
    torque?: string;
    acceleration?: string;
    topSpeed?: string;
    fuelConsumption?: string;
    driveType?: string;
  };
  features?: string[];
  isAvailable?: boolean;
  availableFrom?: string;
  availableTo?: string;
  insurance?: {
    type: string;
    coverage: string;
    excess: number;
  };
  location?: {
    city: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  owner?: {
    id: string;
    name: string;
    phone: string;
    email: string;
    rating: number;
  };
  // ✅ إضافة الشروط والمزايا
  terms?: RentalTerms;
}

// ✅ أنواع الشروط والمزايا
export interface RentalTerms {
  conditions: string[];      // شروط التأجير
  advantages: string[];      // مزايا التأجير
}

export interface AdditionalService {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  icon?: string;
  category?: 'delivery' | 'child_seat' | 'driver' | 'non_smoking' | 'other';
  isAvailable?: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  nameEn?: string;
  icon: string;
  isAvailable: boolean;
  type?: 'card' | 'wallet' | 'bnpl';
}

export interface BookingData {
  // Customer Info
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  
  // Rental Info
  rentalDate: string; // ISO date string
  rentalTime: string; // "09:00"
  dropoffDate?: string; // ISO date string
  dropoffTime?: string; // "17:00"
  rentalDays: number;
  pickupLocation: string;
  pickupAddress: string;
  dropoffLocation?: string;
  dropoffAddress?: string;
  
  // License
  licenseFile: File | null;
  licenseFileName: string;
  
  // Services
  selectedServices: string[]; // IDs of selected services
  
  // Payment
  selectedPaymentMethod: string ;
  paymentMethodType?: 'visa' | 'mastercard' | 'mada' | 'apple_pay' | 'tabby' | 'tamara';
  
  // Calculated
  subtotal: number;
  tax: number;
  total: number;
   pickupLat?: number;      
  pickupLng?: number;
   carId?: string;
  totalAmount?: number;
  priceData?: any;
  uuid?: string;
  city?: string;
  zip?: string;
  insuranceTypeId?: number;
  paymentMethodIndex?: number;
   periodId?: number | null;
}

export interface BookingFormState {
  data: BookingData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isSuccess: boolean;
}

export interface BookingSummaryData {
  carName: string;
  pricePerDay: number;
  rentalDays: number;
  carTotal: number;
  servicesTotal: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface BookingFormData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate?: string;
  dropoffTime?: string;
  rentalDays: number;
  pickupLocation: string;
  pickupAddress: string;
  dropoffLocation?: string;
  dropoffAddress?: string;
  licenseFile: File | null;
  licenseFileName: string;
  selectedServiceIds: string[];
  paymentMethod: string | null;
}

export interface Booking {
  id: string;
  carId: string;
  car: Car;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  rentalDays: number;
  pickupLocation: string;
  pickupAddress: string;
  dropoffLocation?: string;
  dropoffAddress?: string;
  licenseFile: string;
  licenseFileName: string;
  selectedServices: BookingService[];
  paymentMethod: PaymentMethodType;
  subtotal: number;
  tax: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type PaymentMethodType = 'visa' | 'mastercard' | 'mada' | 'apple_pay' | 'tabby' | 'tamara';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface AvailableDate {
  date: string;
  label: string;
}

export interface AvailableTime {
  time: string;
  label: string;
}

export interface CarFilter {
  category?: string[];
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  seats?: number;
  transmission?: string;
  fuelType?: string[];
  location?: string;
  availableFrom?: string;
  availableTo?: string;
}

export interface DeliveryLocation {
  id: string;
  city: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isAvailable?: boolean;
}
export interface BookingRequest {
  category_id: number;
  zip: string;
  delivery_latitude: number;
  rental_company_id: number;
  start_time: string;
  city: string;
  booking_type: 'daily' | 'monthly';
  delivery_longitude: number;
  additional_services?: number[];
  uuid: string;
  delivery_type: string;
  total_days: number;
  car_id: number;
  payment_method_id: number;
  index: number;
  start_date: string;
  delivery_address: string;
  insurance_type_id?: number;
  address: string;
  amount: number;
}
export interface BookingResponse {
  id: number;
  payment_url?: string;
  [key: string]: any;
}


export interface CreateBookingRequest {
  category_id: number;
  zip: string;
  delivery_latitude: number;
  rental_company_id: number;
  start_time: string;
  city: string;
  booking_type: 'daily' | 'monthly';
  delivery_longitude: number;
  additional_services?: number[];
  uuid: string;
  delivery_type: 'to_location' | 'from_location';
  total_days: number;
  car_id: number;
  payment_method_id: number;
  index: number;
  start_date: string;
  delivery_address: string;
  insurance_type_id?: number;
  address: string;
  amount: number;
  rental_company_car_period_id?: number;
}

export interface CreateBookingResponse {
  id: number;
  payment_url?: string;
  status: string;
}