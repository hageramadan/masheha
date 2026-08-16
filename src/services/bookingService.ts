import { Car, AdditionalService, PaymentMethod, BookingData } from '@/src/types/booking';
import { mockCar } from '@/src/data/mock/mockCar';
import { mockServices, mockPaymentMethods } from '@/src/data/mock/mockServices';

// ============================================
// SERVICE LAYER - API Ready
// ============================================

export class BookingService {
  
  // ---- Car ----
  static async getCarById(id: string): Promise<Car> {
    // TODO: استبدال بـ API لاحقاً
    return Promise.resolve({ ...mockCar, id });
  }

  // ---- Services ----
  static async getServices(): Promise<AdditionalService[]> {
    // TODO: استبدال بـ API لاحقاً
    return Promise.resolve(mockServices);
  }

  // ---- Payment Methods ----
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    // TODO: استبدال بـ API لاحقاً
    return Promise.resolve(mockPaymentMethods);
  }

  // ---- Submit Booking ----
  static async submitBooking(data: BookingData): Promise<{ success: boolean; message: string; bookingId?: string }> {
    // TODO: استبدال بـ API لاحقاً
    console.log('📦 Booking Data:', data);
    
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: 'تم حجز السيارة بنجاح!',
      bookingId: `booking-${Date.now()}`,
    };
  }

  // ---- Validate License File ----
  static validateLicenseFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'يجب أن يكون الملف PDF, PNG, أو JPG' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: 'حجم الملف يجب أن يكون أقل من 5 ميجابايت' };
    }

    return { isValid: true };
  }
}