/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
  result: boolean;
  errNum: number;
  message: string;
  data: T;
}

// ============================================
// DAILY CARS API TYPES
// ============================================

export interface DailyCarsResponse {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  acceptance_rate: number;
  customer_satisfaction_rate: number;
  delivery_speed_rate: number;
  is_enabled: boolean | null;
  image_url: string;
  average_rating: number;
  count_reviews: number;
  distance: number | null;
  quick_policy: QuickPolicy;
  additional_services: AdditionalServiceAPI[];
  insurance_types: InsuranceType[];
  branches: any[];
  icons: Icon[];
  cars: CarAPI[];
}

export interface QuickPolicy {
  id: number;
  pickup_within_hour_text: string;
  deductible_text: string;
  km_limit_text: string;
  status: string;
}

export interface AdditionalServiceAPI {
  id: number;
  name: string;
  description: string;
  period_type: 'daily' | 'yearly' | 'monthly';
  price: number;
  price_per_day: number;
  discount: number;
  status: string;
  image_url: string;
}
// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
  result: boolean;
  errNum: number;
  message: string;
  data: T;
}

// ============================================
// DAILY CARS API TYPES
// ============================================

export interface DailyCarsResponse {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  acceptance_rate: number;
  customer_satisfaction_rate: number;
  delivery_speed_rate: number;
  is_enabled: boolean | null;
  image_url: string;
  average_rating: number;
  count_reviews: number;
  distance: number | null;
  quick_policy: QuickPolicy;
  additional_services: AdditionalServiceAPI[];
  insurance_types: InsuranceType[];
  branches: any[];
  icons: Icon[];
  cars: CarAPI[];
}

export interface QuickPolicy {
  id: number;
  pickup_within_hour_text: string;
  deductible_text: string;
  km_limit_text: string;
  status: string;
}

export interface AdditionalServiceAPI {
  id: number;
  name: string;
  description: string;
  period_type: 'daily' | 'yearly' | 'monthly';
  price: number;
  price_per_day: number;
  discount: number;
  status: string;
  image_url: string;
}

export interface InsuranceType {
  id: number;
  name: string;
  description: string;
  period_type: string;
  price: number;
  coverage_percent: number;
  deductible_text: string;
  status: string;
}

export interface Icon {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  top: boolean;
  rental_company_id: number;
}

export interface CarAPI {
  id: number;
  name: string;
  brand: Brand;
  car_category: CarCategory;
  model_year: string;
  image_url: string;
  minimum_days: number;
  price_per_day: number;
  discount: number;
  price_per_day_after_discount: number;
  is_featured: boolean;
  status: string;
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  status: string;
  image_url: string;
}

export interface CarCategory {
  id: number;
  name: string;
  description: string | null;
}


// ============================================
// MONTHLY CARS API TYPES
// ============================================

export interface MonthlyCarsResponse {
  most_requested: MonthlyBrandsSection;
  recommended: MonthlyCarsSection;
  under_2500: MonthlyCarsSection;
  suv: MonthlyCarsSection;
  by_category: Record<string, MonthlyCarsSection>;
}

export interface MonthlyBrandsSection {
  status: boolean;
  title: string;
  brands: Brand[];
}

export interface MonthlyCarsSection {
  status: boolean;
  title: string;
  cars: MonthlyCar[];
}

export interface MonthlyCar {
  id: number;
  name: string;
  model_year: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  doors: number;
  luggage: number;
  rating: number | null;
  image_url: string;
  minimum_days: number;
  brand: Brand;
  car_category: CarCategory;
  monthly_price: number;
  monthly_discount: number | null;
  monthly_price_after_discount: number;
  office: Office;
}

export interface MonthlyCategorySection {
  status: boolean;
  title: string;
  categories: MonthlyCategory[];
}

export interface MonthlyCategory {
  id: number;
  name: string;
  image_url: string;
  status: string;
}

// ============================================
// OFFICE TYPE
// ============================================

export interface Office {
  id: number;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  delivery_duration: number;
  acceptance_rate: number;
  rate: number;
  customer_satisfaction_rate: number;
  delivery_speed_rate: number;
  is_enabled: boolean | null;
  average_rating: number;
  count_reviews: number;
  image_url: string;
  quick_policy: QuickPolicy;
  additional_services: AdditionalServiceAPI[];
  insurance_types: InsuranceType[];
  branches: any[];
  icons: Icon[];
}
export interface InsuranceType {
  id: number;
  name: string;
  description: string;
  period_type: string;
  price: number;
  coverage_percent: number;
  deductible_text: string;
  status: string;
}

export interface Icon {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  top: boolean;
  rental_company_id: number;
}

export interface CarAPI {
  id: number;
  name: string;
  brand: Brand;
  car_category: CarCategory;
  model_year: string;
  image_url: string;
  minimum_days: number;
  price_per_day: number;
  discount: number;
  price_per_day_after_discount: number;
  is_featured: boolean;
  status: string;
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  status: string;
  image_url: string;
}

export interface CarCategory {
  id: number;
  name: string;
  description: string | null;
}


// ============================================
// MONTHLY CARS API TYPES
// ============================================

export interface MonthlyCarsResponse {
  most_requested: MonthlyBrandsSection;
  recommended: MonthlyCarsSection;
  under_2500: MonthlyCarsSection;
  suv: MonthlyCarsSection;
  by_category: Record<string, MonthlyCarsSection>;
}

export interface MonthlyBrandsSection {
  status: boolean;
  title: string;
  brands: Brand[];
}

export interface MonthlyCarsSection {
  status: boolean;
  title: string;
  cars: MonthlyCar[];
}
// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T> {
  result: boolean;
  errNum: number;
  message: string;
  data: T;
}

// ============================================
// DAILY CARS API TYPES
// ============================================

export interface DailyCarsResponse {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  acceptance_rate: number;
  customer_satisfaction_rate: number;
  delivery_speed_rate: number;
  is_enabled: boolean | null;
  image_url: string;
  average_rating: number;
  count_reviews: number;
  distance: number | null;
  quick_policy: QuickPolicy;
  additional_services: AdditionalServiceAPI[];
  insurance_types: InsuranceType[];
  branches: any[];
  icons: Icon[];
  cars: CarAPI[];
}

export interface QuickPolicy {
  id: number;
  pickup_within_hour_text: string;
  deductible_text: string;
  km_limit_text: string;
  status: string;
}

export interface AdditionalServiceAPI {
  id: number;
  name: string;
  description: string;
  period_type: 'daily' | 'yearly' | 'monthly';
  price: number;
  price_per_day: number;
  discount: number;
  status: string;
  image_url: string;
}

export interface InsuranceType {
  id: number;
  name: string;
  description: string;
  period_type: string;
  price: number;
  coverage_percent: number;
  deductible_text: string;
  status: string;
}

export interface Icon {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  top: boolean;
  rental_company_id: number;
}

export interface CarAPI {
  id: number;
  name: string;
  brand: Brand;
  car_category: CarCategory;
  model_year: string;
  image_url: string;
  minimum_days: number;
  price_per_day: number;
  discount: number;
  price_per_day_after_discount: number;
  is_featured: boolean;
  status: string;
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  status: string;
  image_url: string;
}

export interface CarCategory {
  id: number;
  name: string;
  description: string | null;
}


// ============================================
// MONTHLY CARS API TYPES
// ============================================

export interface MonthlyCarsResponse {
  most_requested: MonthlyBrandsSection;
  recommended: MonthlyCarsSection;
  under_2500: MonthlyCarsSection;
  suv: MonthlyCarsSection;
  by_category: Record<string, MonthlyCarsSection>; 
}

export interface MonthlyBrandsSection {
  status: boolean;
  title: string;
  brands: Brand[];
}

export interface MonthlyCarsSection {
  status: boolean;
  title: string;
  cars: MonthlyCar[];
}

export interface MonthlyCar {
  id: number;
  name: string;
  model_year: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  doors: number;
  luggage: number;
  rating: number | null;
  image_url: string;
  minimum_days: number;
  brand: Brand;
  car_category: CarCategory;
  monthly_price: number;
  monthly_discount: number | null;
  monthly_price_after_discount: number;
  office: Office;
}

// ============================================
// OFFICE TYPE
// ============================================

export interface Office {
  id: number;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  delivery_duration: number;
  acceptance_rate: number;
  rate: number;
  customer_satisfaction_rate: number;
  delivery_speed_rate: number;
  is_enabled: boolean | null;
  average_rating: number;
  count_reviews: number;
  image_url: string;
  quick_policy: QuickPolicy;
  additional_services: AdditionalServiceAPI[];
  insurance_types: InsuranceType[];
  branches: any[];
  icons: Icon[];
}

export interface MonthlyCar {
  id: number;
  name: string;
  model_year: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  doors: number;
  luggage: number;
  rating: number | null;
  image_url: string;
  minimum_days: number;
  brand: Brand;
  car_category: CarCategory;
  monthly_price: number;
  monthly_discount: number | null;
  monthly_price_after_discount: number;
  office: Office;
}
// src/types/api.ts

// ============================================
// CAR DETAILS API TYPES
// ============================================

export interface CarDetailsResponse {
  id: number;
  name: string;
  brand: Brand;
  model_year: string;
  image_url: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  doors: number;
  luggage: number;
  rating: number | null;
  is_featured: number;
  status: string;
  minimum_days: number;
  // price_per_day: number;
  // discount: number;
  // price_per_day_after_discount: number;
  office: Office;
  guarantees: Guarantee[];
  cancellation_policies: CancellationPolicy[];
  // periods: Period[];
  branches: any[];
}

export interface Guarantee {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: string;
}

export interface CancellationPolicy {
  id: number;
  title: string;
  description: string;
  color: string;
  status: string;
}

export interface Period {
  label: string;
  days: number;
  type: string;
  price: number;
  discount: number;
}

// ============================================
// CAR DETAILS API TYPES
// ============================================

export interface CarDetailsResponse {
  id: number;
  name: string;
  brand: Brand;
  model_year: string;
  image_url: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  doors: number;
  luggage: number;
  rating: number | null;
  is_featured: number;
  status: string;
  minimum_days: number;
  price_per_day?: number;
  discount?: number;
  price_per_day_after_discount?: number;
  price_per_month?: number;
  price_per_month_after_discount?: number;
  office: Office;
  guarantees: Guarantee[];
  cancellation_policies: CancellationPolicy[];
  periods?: Period[];
  branches: any[];
}

export interface Guarantee {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: string;
}

export interface CancellationPolicy {
  id: number;
  title: string;
  description: string;
  color: string;
  status: string;
}

export interface Period {
  id?: number;
  label: string;
  days: number;
  type: string;
  price: number;
  discount: number ;
  price_total?: number;
  days_count?: number;
  rental_company_car_id?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}
export interface AvailableHour {
  time: string;
  label: string;
  is_available: boolean;
}

export interface AvailableDate {
  date: string;
  day_name: string;
  is_available: boolean;
  available_hours: AvailableHour[];
}

export interface AvailablePeriodsResponse {
  type: 'daily' | 'monthly';
  available_dates: AvailableDate[];
  available_months: any;
  available_years: any;
  working_hours: any;
  min_advance_booking_hours: number;
  max_advance_booking_days: number;
  min_advance_booking_days: any;
  max_advance_booking_months: any;
  max_advance_booking_years: any;
}
export interface PaymentMethod {
  id: number;
  name: string;
  status: string;
  fee: number | null;
  image: string;
}

export interface PaymentMethodsResponse {
  services: PaymentMethod[];
}

export interface CalculatePriceRequest {
  booking_type: 'daily' | 'monthly';
  rental_company_id: number;
  start_date: string;
  total_days: number;
  car_id: number;
  start_time: string;
  additional_services?: number[];
}

export interface PriceBreakdown {
  base_price: number;
  discount: number;
  coupon_discount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface CalculatePriceResponse {
  base_price: number;
  discount_amount: number;
  coupon_discount: number;
  tax_amount: number;
  total_amount: number;
  total_days: number;
  price_breakdown: PriceBreakdown;
}
export interface SliderResponse {
  addresses: {
    id: number;
    title: string;
    url: string | null;
    image: string;
  }[];
}

export interface CheckoutRequest {
  car_name: string;
  amount: number;
  index: number;
  uuid: string;
  zip: string;
  payment_method: number;
  address: string;
  city: string;
   callback_url?: string; 
  return_url?: string;
}

export interface CheckoutResponse {
  payment?: {
    payment_keys?: {
      integration: number;
      key: string;
      gateway_type: string;
      redirection_url: string;
    }[];
    intention_order_id: number;
    id: string;
    client_secret: string;
    payment_methods: {
      integration_id: number;
      name: string;
      method_type: string;
    }[];
    status: string;
    confirmed: boolean;
  };
  payment_url?: string;
}

export interface Booking {
  id: number;
  identification_number: string;
  booking_type: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  total_days: number;
  base_price: string;
  discount_amount: string;
  coupon_discount: string;
  tax_amount: string;
  total_amount: string;
  status: string;
  status_label: string;
  status_number: number;
  is_extended: number;
  payment_status: string;
  delivery_type: string;
  delivery_address: string | null;
  delivery_latitude: number;
  delivery_longitude: number;
  created_at: string;
  rental_company: {
    id: number;
    name: string;
    image: string;
    average_rating: number;
    count_reviews: number;
    branches: any[];
  };
  branch: any;
  quick_policy: {
    id: number;
    pickup_within_hour_text: string;
    deductible_text: string;
    km_limit_text: string;
    status: string;
  };
  category: {
    id: number;
    name: string;
  };
  car: {
    id: number;
    name: string;
    model_year: string;
    imageUrl: string;
    brand: {
      id: number;
      name: string;
    };
  };
  payment_method: {
    id: number;
    name: string;
  };
  coupon: any;
}

export interface BookingsResponse {
  result: boolean;
  errNum: number;
  message: string;
  data: {
    bookings: Booking[];
    statistics: {
      total: number;
      current: number;
      completed: number;
      upcoming: number;
      ongoing: number;
      by_type: {
        daily: number;
        monthly: number;
        yearly: number;
      };
      by_status: {
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
      };
    };
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export interface BookingDetailResponse {
  result: boolean;
  errNum: number;
  message: string;
  data: BookingDetail;
}

export interface BookingDetail {
  id: number;
  uuid: string;
  identification_number: string;
  booking_type: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  total_days: number;
  base_price: string;
  discount_amount: string;
  coupon_discount: string;
  tax_amount: string;
  total_amount: string;
  status: string;
  payment_status: string;
  delivery_type: string;
  delivery_address: string | null;
  delivery_latitude: number;
  delivery_longitude: number;
  notes: string | null;
  phone: string;
  address: string | null;
  city: string;
  zip: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    phone: string;
    email: string | null;
  };
  rental_company: {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
    branches: any[];
  };
  branch: any;
  category: {
    id: number;
    name: string;
    description: string;
  };
  car: {
    id: number;
    name: string;
    model_year: string;
    transmission: string;
    fuel_type: string;
    seats: number;
    doors: number;
    luggage: number;
    rating: any;
    image: string;
    brand: {
      id: number;
      name: string;
    };
    category: {
      id: number;
      name: string;
      image_url: string;
    };
  };
  payment_method: {
    id: number;
    name: string;
    description: string;
  };
  coupon: any;
  period: any;
  price_breakdown: {
    base_price: string;
    discount: string;
    coupon_discount: string;
    subtotal: string;
    tax: string;
    total: string;
  };
  status_info: {
    is_cancellable: boolean;
    is_rated: boolean;
    can_be_paid: boolean;
    formatted_start_datetime: string;
    formatted_end_datetime: string;
  };
  monthly_payment: any;
  additional_services: any[];
  additional_services_total_price: string;
  insurance: {
    id: number;
    name: string;
    description: string;
    period_type: string;
    price: number;
    coverage_percent: number;
    deductible_text: string;
    status: string;
  };
  quick_policy: {
    id: number;
    pickup_within_hour_text: string;
    deductible_text: string;
    km_limit_text: string;
    status: string;
  };
  guarantees: any[];
}