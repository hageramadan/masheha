// ============================================
// CAR TYPES (For Frontend)
// ============================================

export interface Car {
  id: string | number;
  name: string;
  brand: string;
  brandLogo?: string;
  model: string;
  year: number | string;
  pricePerDay: number;
  pricePerDayAfterDiscount: number;
  discount: number;
  image: string;
  images?: string[];
  category: string;
  categoryId?: number;
  minimumDays: number;
  isFeatured: boolean;
  status: string;
  description?: string;
  specifications?: {
    engine?: string;
    horsepower?: string;
    color?: string;
  };
  // Provider Info
  providerId?: number;
  providerName?: string;
  providerImage?: string;
  acceptanceRate?: number;
  customerSatisfactionRate?: number;
  deliverySpeedRate?: number;
  // Quick Policy
  quickPolicy?: QuickPolicy;
  // Icons
  icons?: Icon[];
  // Ratings
  averageRating?: number;
  countReviews?: number;
}

export interface QuickPolicy {
  pickupWithinHourText: string;
  deductibleText: string;
  kmLimitText: string;
}

export interface Icon {
  id: number;
  title: string;
  image: string;
}

export interface AdditionalService {
  id: string | number;
  name: string;
  description: string;
  price: number;
  periodType?: 'daily' | 'yearly' | 'monthly';
  pricePerDay?: number;
  isAvailable?: boolean;
  imageUrl?: string;
}

export interface InsuranceType {
  id: number;
  name: string;
  description: string;
  price: number;
  coveragePercent: number;
  deductibleText: string;
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
  city?: string;
}