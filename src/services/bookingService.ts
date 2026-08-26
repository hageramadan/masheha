// src/services/bookingService.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Car, AdditionalService, PaymentMethod, BookingData, CreateBookingRequest } from '@/src/types/booking';
import { mockCar } from '@/src/data/mock/mockCar';
import { mockServices, mockPaymentMethods } from '@/src/data/mock/mockServices';
import { CarService } from './carService';
import { CheckoutRequest } from '../types/api';

export class BookingService {
  
  static async getCarById(id: string): Promise<Car> {
    return Promise.resolve({ ...mockCar, id });
  }

  static async getServices(): Promise<AdditionalService[]> {
    return Promise.resolve(mockServices);
  }

  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    return Promise.resolve(mockPaymentMethods);
  }

  // src/services/bookingService.ts

  static async submitBooking(
    data: BookingData,
    carData: any,
    rentalType: 'daily' | 'monthly',
    token: string
  ): Promise<{ 
    success: boolean; 
    message: string; 
    bookingId?: string; 
    paymentUrl?: string;
    uuid?: string;
    zip?: string;
  }> {
    try {
      const paymentMethodId = parseInt(data.selectedPaymentMethod) || 0;
      const paymentMethods = await CarService.getPaymentMethods();
      const index = paymentMethods.findIndex(
        (method) => method.id === paymentMethodId
      );
      const finalIndex = index !== -1 ? index : 1;

      let insuranceTypeId = 4;
      
      if (carData?.insuranceTypeId) {
        insuranceTypeId = carData.insuranceTypeId;
      } else if (carData?.office?.insurance_types?.length > 0) {
        insuranceTypeId = carData.office.insurance_types[0].id;
      } else if (data?.insuranceTypeId) {
        insuranceTypeId = data.insuranceTypeId;
      }

      const bookingParams: CreateBookingRequest = {
        category_id: carData?.categoryId || 1,
        zip: data.zip || '12251',
        delivery_latitude: data.pickupLat || 24.7136,
        rental_company_id: carData?.providerId || carData?.office?.id || 0,
        start_time: data.rentalTime || '16:00',
        city: data.city || 'الرياض',
        booking_type: rentalType,
        delivery_longitude: data.pickupLng || 46.6953,
        additional_services: data.selectedServices?.map(id => parseInt(id)) || [],
        uuid: data.uuid || crypto.randomUUID(),
        delivery_type: 'to_location',
        total_days: data.rentalDays || 1,
        car_id: parseInt(data.carId || '0'),
        payment_method_id: paymentMethodId,
        index: finalIndex,
        start_date: data.rentalDate || '',
        delivery_address: data.pickupAddress || '',
        insurance_type_id: insuranceTypeId,
        address: data.pickupAddress || '',
        amount: data.totalAmount || 0,
          ...(rentalType === 'monthly' && data.periodId && {
        rental_company_car_period_id: data.periodId,
    }),
      };

      // تنظيف المعاملات من القيم غير المعرفة
      // Object.keys(bookingParams).forEach(key => {
      //   if (bookingParams[key as keyof CreateBookingRequest] === undefined) {
      //     delete bookingParams[key as keyof CreateBookingRequest];
      //   }
      // });
      Object.keys(bookingParams).forEach(key => {
    const value = bookingParams[key as keyof CreateBookingRequest];
    if (value === undefined || value === null) {
        delete bookingParams[key as keyof CreateBookingRequest];
    }
});

      const response = await CarService.createBooking(bookingParams, token);

      return {
        success: true,
        message: 'تم الحجز بنجاح!',
        bookingId: String(response.id),
        paymentUrl: response.payment_url,
        uuid: data.uuid,
        zip: data.zip,
      };
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      return {
        success: false,
        message: error.message || 'حدث خطأ أثناء الحجز',
      };
    }
  }

  static validateLicenseFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'يجب أن يكون الملف PDF, PNG, أو JPG' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'حجم الملف يجب أن يكون أقل من 5 ميجابايت' };
    }

    return { isValid: true };
  }

  // ✅ **الدالة المعدلة: إضافة callback_url**
  static async processPayment(
    bookingData: {
      carName: string;
      amount: number;
      paymentMethodId: number;
      uuid: string;
      zip: string;
      address: string;
      city: string;
      index: number;
      callback_url?: string; // ✅ إضافة callback_url اختياري
      return_url?: string;   // ✅ إضافة return_url اختياري
    },
    token: string
  ): Promise<{ success: boolean; message: string; paymentUrl?: string; paymentData?: any }> {
    try {
      console.log('📤 processPayment called with:', bookingData);

      // ✅ بناء المعاملات مع callback_url
      const checkoutParams: CheckoutRequest = {
        car_name: bookingData.carName,
        amount: bookingData.amount,
        index: bookingData.index,
        uuid: bookingData.uuid,
        zip: bookingData.zip || '12251',
        payment_method: bookingData.paymentMethodId,
        address: bookingData.address,
        city: bookingData.city || 'الرياض',
        callback_url: bookingData.callback_url, // ✅ إرسال callback_url
        return_url: bookingData.return_url,     // ✅ إرسال return_url
      };

      console.log('📤 Processing payment:', checkoutParams);

      const response = await CarService.checkout(checkoutParams, token);
      
      console.log('📥 Checkout response in processPayment:', response);

      // ✅ تحقق من وجود رابط الدفع
      if (!response.payment_url) {
        console.error('❌ No payment URL in response:', response);
        return {
          success: false,
          message: 'لم يتم استلام رابط الدفع من الخادم',
        };
      }

      return {
        success: true,
        message: 'تم توجيهك إلى بوابة الدفع',
        paymentUrl: response.payment_url,
        paymentData: response.payment_data,
      };
    } catch (error: any) {
      console.error('❌ Error in processPayment:', error);
      return {
        success: false,
        message: error.message || 'حدث خطأ أثناء عملية الدفع',
      };
    }
  }
}