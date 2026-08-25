// import { BookingDetailResponse, BookingsResponse } from "../types/api";

// // تكوين الـ API
// const BASE_URL = "https://admin.masheha.com/api";

// // دالة للحصول على التوكن
// function getToken(): string | null {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("token");
//   }
//   return null;
// }

// // دالة مساعدة للـ Request
// async function request<T>(
//   endpoint: string,
//   options: RequestInit = {},
// ): Promise<T> {
//   const token = getToken();

//   const headers: HeadersInit = {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     "accept-language": "ar",
//     ...options.headers,
//   };

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   const response = await fetch(`${BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//   });

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(
//       errorData.message ||
//         `API request failed: ${response.status} ${response.statusText}`,
//     );
//   }

//   return response.json();
// }

// export async function getBookings(
//   filter?: string, 
//   page: number = 1,
//   perPage: number = 10
// ): Promise<BookingsResponse> {
//   const queryParams = new URLSearchParams();
//   if (filter) {
//     queryParams.append('status', filter);
//   }
//   queryParams.append('page', page.toString());
//   queryParams.append('per_page', perPage.toString());
  
//   const endpoint = `/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
//   return request<BookingsResponse>(endpoint);
// }


// export async function getBookingDetails(bookingId: number): Promise<BookingDetailResponse> {
//   return request<BookingDetailResponse>(`/bookings/${bookingId}`);
// }

// export async function checkExtension(bookingId: number): Promise<{
//   can_extend: boolean;
//   has_ended: boolean;
//   is_active: boolean;
//   is_within_extension_window: boolean;
//   current_end_date: string;
//   current_end_time: string;
//   end_datetime: string;
//   current_datetime: string;
//   max_extension_days: number;
//   tax: string;
//   daily_price: number;
// }> {
//   const response = await request<{
//     result: boolean;
//     errNum: number;
//     message: string;
//     data: {
//       can_extend: boolean;
//       has_ended: boolean;
//       is_active: boolean;
//       is_within_extension_window: boolean;
//       current_end_date: string;
//       current_end_time: string;
//       end_datetime: string;
//       current_datetime: string;
//       max_extension_days: number;
//       tax: string;
//       daily_price: number;
//     };
//   }>(`/bookings/${bookingId}/check-extension`);

//   if (!response.result) {
//     throw new Error(response.message || 'فشل في التحقق من إمكانية التمديد');
//   }

//   return response.data;
// }

// // دالة لجلب الأيام المتاحة للتمديد
// export async function getAvailableExtensionDays(
//   bookingId: number,
//   extensionDays: number
// ): Promise<{
//   requested_days: number;
//   available_days: number;
//   tax_amount: string;
//   extension_price: number;
//   daily_price: number;
//   new_end_date: string;
//   new_end_time: string;
//   conflicts: Array<{
//     booking_id: number;
//     start_date: string;
//     end_date: string;
//   }>;
// }> {
//   const response = await request<{
//     result: boolean;
//     errNum: number;
//     message: string;
//     data: {
//       requested_days: number;
//       available_days: number;
//       tax_amount: string;
//       extension_price: number;
//       daily_price: number;
//       new_end_date: string;
//       new_end_time: string;
//       conflicts: Array<{
//         booking_id: number;
//         start_date: string;
//         end_date: string;
//       }>;
//     };
//   }>(`/bookings/${bookingId}/available-extension-days`, {
//     method: 'POST',
//     body: JSON.stringify({ extension_days: extensionDays }),
//   });

//   if (!response.result) {
//     throw new Error(response.message || 'فشل في جلب أيام التمديد المتاحة');
//   }

//   return response.data;
// }

// // دالة لتنفيذ تمديد الحجز
// export async function extendBooking(
//   bookingId: number,
//   extensionDays: number
// ): Promise<{
//   id: number;
//   identification_number: string;
//   booking_type: string;
//   start_date: string;
//   start_time: string;
//   end_date: string;
//   end_time: string;
//   total_days: number;
//   base_price: string;
//   discount_amount: string;
//   coupon_discount: string;
//   tax_amount: string;
//   total_amount: string;
//   status: string;
//   status_label: string;
//   status_number: number;
//   is_extended: number;
//   payment_status: string;
// }> {
//   const response = await request<{
//     result: boolean;
//     errNum: number;
//     message: string;
//     data: {
//       id: number;
//       identification_number: string;
//       booking_type: string;
//       start_date: string;
//       start_time: string;
//       end_date: string;
//       end_time: string;
//       total_days: number;
//       base_price: string;
//       discount_amount: string;
//       coupon_discount: string;
//       tax_amount: string;
//       total_amount: string;
//       status: string;
//       status_label: string;
//       status_number: number;
//       is_extended: number;
//       payment_status: string;
//     };
//   }>(`/bookings/${bookingId}/extend`, {
//     method: 'POST',
//     body: JSON.stringify({ extension_days: extensionDays }),
//   });

//   if (!response.result) {
//     throw new Error(response.message || 'فشل في تمديد الحجز');
//   }

//   return response.data;
// }




// src/services/bookingApiService.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

// تعريف الـ Types
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

// تكوين الـ API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin.masheha.com/api';

// دالة للحصول على التوكن
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// ✅ إصلاح: دالة مساعدة للـ Request
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  // ✅ استخدام Record بدلاً من HeadersInit
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// دالة لجلب قائمة الحجوزات مع فلتر ورقم الصفحة
export async function getBookings(
  filter?: string, 
  page: number = 1,
  perPage: number = 10
): Promise<BookingsResponse> {
  const queryParams = new URLSearchParams();
  if (filter) {
    queryParams.append('status', filter);
  }
  queryParams.append('page', page.toString());
  queryParams.append('per_page', perPage.toString());
  
  const endpoint = `/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return request<BookingsResponse>(endpoint);
}

// دالة لجلب تفاصيل الحجز
export async function getBookingDetails(bookingId: number): Promise<BookingDetailResponse> {
  return request<BookingDetailResponse>(`/bookings/${bookingId}`);
}

// دالة للتحقق من إمكانية التمديد
export async function checkExtension(bookingId: number): Promise<{
  can_extend: boolean;
  has_ended: boolean;
  is_active: boolean;
  is_within_extension_window: boolean;
  current_end_date: string;
  current_end_time: string;
  end_datetime: string;
  current_datetime: string;
  max_extension_days: number;
  tax: string;
  daily_price: number;
}> {
  const response = await request<{
    result: boolean;
    errNum: number;
    message: string;
    data: {
      can_extend: boolean;
      has_ended: boolean;
      is_active: boolean;
      is_within_extension_window: boolean;
      current_end_date: string;
      current_end_time: string;
      end_datetime: string;
      current_datetime: string;
      max_extension_days: number;
      tax: string;
      daily_price: number;
    };
  }>(`/bookings/${bookingId}/check-extension`);

  if (!response.result) {
    throw new Error(response.message || 'فشل في التحقق من إمكانية التمديد');
  }

  return response.data;
}

// دالة لجلب الأيام المتاحة للتمديد
export async function getAvailableExtensionDays(
  bookingId: number,
  extensionDays: number
): Promise<{
  requested_days: number;
  available_days: number;
  tax_amount: string;
  extension_price: number;
  daily_price: number;
  new_end_date: string;
  new_end_time: string;
  conflicts: Array<{
    booking_id: number;
    start_date: string;
    end_date: string;
  }>;
}> {
  const response = await request<{
    result: boolean;
    errNum: number;
    message: string;
    data: {
      requested_days: number;
      available_days: number;
      tax_amount: string;
      extension_price: number;
      daily_price: number;
      new_end_date: string;
      new_end_time: string;
      conflicts: Array<{
        booking_id: number;
        start_date: string;
        end_date: string;
      }>;
    };
  }>(`/bookings/${bookingId}/available-extension-days`, {
    method: 'POST',
    body: JSON.stringify({ extension_days: extensionDays }),
  });

  if (!response.result) {
    throw new Error(response.message || 'فشل في جلب أيام التمديد المتاحة');
  }

  return response.data;
}

// دالة لتنفيذ تمديد الحجز
export async function extendBooking(
  bookingId: number,
  extensionDays: number
): Promise<{
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
}> {
  const response = await request<{
    result: boolean;
    errNum: number;
    message: string;
    data: {
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
    };
  }>(`/bookings/${bookingId}/extend`, {
    method: 'POST',
    body: JSON.stringify({ extension_days: extensionDays }),
  });

  if (!response.result) {
    throw new Error(response.message || 'فشل في تمديد الحجز');
  }

  return response.data;
}
