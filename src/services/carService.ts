/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiService } from "./apiService";
import {
  ApiResponse,
  DailyCarsResponse,
  CarAPI,
  MonthlyCarsResponse,
  CarDetailsResponse,
  AvailablePeriodsResponse,
  PaymentMethodsResponse,
  PaymentMethod,
  CalculatePriceResponse,
  CalculatePriceRequest,
  SliderResponse,
  CheckoutResponse,
  CheckoutRequest,
} from "@/src/types/api";
import {
  Car,
  AdditionalService,
  InsuranceType as FrontendInsurance,
  Icon,
  QuickPolicy,
} from "@/src/types/car";
import { CreateBookingRequest, CreateBookingResponse } from "../types/booking";

// ============================================
// CAR SERVICE - API Implementation
// ============================================

export class CarService extends ApiService {
  private static cachedRawData: DailyCarsResponse[] | null = null;
  private static cacheTimestamp: number | null = null;
  private static CACHE_DURATION = 5 * 60 * 1000;

  static async getDailyCarsRaw(
    forceRefresh: boolean = false,
  ): Promise<DailyCarsResponse[]> {
    // التحقق من Cache
    if (!forceRefresh && this.cachedRawData && this.cacheTimestamp) {
      const now = Date.now();
      if (now - this.cacheTimestamp < this.CACHE_DURATION) {
        return this.cachedRawData;
      }
    }

    try {
      const response =
        await this.get<ApiResponse<DailyCarsResponse[]>>("/daily-cars");

      if (!response.result) {
        throw new Error(response.message || "فشل في جلب السيارات");
      }

      // تخزين في Cache
      this.cachedRawData = response.data;
      this.cacheTimestamp = Date.now();

      return response.data;
    } catch (error) {
      console.error("Error fetching daily cars raw:", error);
      throw error;
    }
  }

  static async getDailyCars(forceRefresh: boolean = false): Promise<Car[]> {
    const rawData = await this.getDailyCarsRaw(forceRefresh);

    const cars: Car[] = [];
    rawData.forEach((provider) => {
      provider.cars.forEach((carAPI) => {
        cars.push(this.mapCarAPIToCar(carAPI, provider));
      });
    });

    return cars;
  }

  static async getCarById(id: string | number): Promise<Car | null> {
    try {
      const cars = await this.getDailyCars();
      return cars.find((car) => car.id === id) || null;
    } catch (error) {
      console.error("Error fetching car by id:", error);
      throw error;
    }
  }

  static async getProviderServices(
    providerId: number,
  ): Promise<AdditionalService[]> {
    try {
      const rawData = await this.getDailyCarsRaw();
      const provider = rawData.find((p) => p.id === providerId);

      if (!provider) {
        return [];
      }

      return provider.additional_services.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        periodType: service.period_type,
        pricePerDay: service.price_per_day,
        isAvailable: service.status === "active",
        imageUrl: service.image_url,
      }));
    } catch (error) {
      console.error("Error fetching provider services:", error);
      throw error;
    }
  }

  static async getProviderInsurance(
    providerId: number,
  ): Promise<FrontendInsurance[]> {
    try {
      const rawData = await this.getDailyCarsRaw();
      const provider = rawData.find((p) => p.id === providerId);

      if (!provider) {
        return [];
      }

      return provider.insurance_types.map((insurance) => ({
        id: insurance.id,
        name: insurance.name,
        description: insurance.description,
        price: insurance.price,
        coveragePercent: insurance.coverage_percent,
        deductibleText: insurance.deductible_text,
      }));
    } catch (error) {
      console.error("Error fetching provider insurance:", error);
      throw error;
    }
  }

  private static mapCarAPIToCar(
    carAPI: CarAPI,
    provider: DailyCarsResponse,
  ): Car {
    const icons: Icon[] =
      provider.icons?.map((icon) => ({
        id: icon.id,
        title: icon.title,
        image: icon.icon || icon.image,
      })) || [];

    const quickPolicy: QuickPolicy = {
      pickupWithinHourText:
        provider.quick_policy?.pickup_within_hour_text || "",
      deductibleText: provider.quick_policy?.deductible_text || "",
      kmLimitText: provider.quick_policy?.km_limit_text || "",
    };

    return {
      id: carAPI.id,
      name: carAPI.name,
      brand: carAPI.brand?.name || "غير معروف",
      brandLogo: carAPI.brand?.image_url || "",
      model: carAPI.brand?.name || "",
      year: carAPI.model_year,
      pricePerDay: carAPI.price_per_day,
      pricePerDayAfterDiscount: carAPI.price_per_day_after_discount,
      discount: carAPI.discount,
      image: carAPI.image_url,
      category: carAPI.car_category?.name || "غير معروف",
      categoryId: carAPI.car_category?.id,
      minimumDays: carAPI.minimum_days,
      isFeatured: carAPI.is_featured,
      status: carAPI.status,
      providerId: provider.id,
      providerName: provider.name,
      providerImage: provider.image_url,
      acceptanceRate: provider.acceptance_rate,
      customerSatisfactionRate: provider.customer_satisfaction_rate,
      deliverySpeedRate: provider.delivery_speed_rate,
      quickPolicy,
      icons,
      averageRating: provider.average_rating,
      countReviews: provider.count_reviews,
    };
  }

  static async getFilteredCars(filters: {
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Car[]> {
    const cars = await this.getDailyCars();

    return cars.filter((car) => {
      let match = true;

      if (filters.category && car.category !== filters.category) {
        match = false;
      }

      if (
        filters.city &&
        car.providerName &&
        !car.providerName.includes(filters.city)
      ) {
        match = false;
      }

      if (filters.minPrice && car.pricePerDay < filters.minPrice) {
        match = false;
      }

      if (filters.maxPrice && car.pricePerDay > filters.maxPrice) {
        match = false;
      }

      return match;
    });
  }

  static clearCache(): void {
    this.cachedRawData = null;
    this.cacheTimestamp = null;
  }

  static async refreshCache(): Promise<DailyCarsResponse[]> {
    return this.getDailyCarsRaw(true);
  }

  static async getMonthlyCars(): Promise<MonthlyCarsResponse> {
    try {
      const response = await this.get<ApiResponse<MonthlyCarsResponse>>(
        "/monthly-popular-companies",
      );

      if (!response.result) {
        throw new Error(response.message || "فشل في جلب السيارات الشهرية");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching monthly cars:", error);
      throw error;
    }
  }

  static async getDailyCarDetails(
    officeId: number,
    carId: number,
  ): Promise<CarDetailsResponse> {
    console.log(`📡 Fetching: /daily-cars/${officeId}/${carId}`);
    try {
      const response = await this.get<ApiResponse<CarDetailsResponse>>(
        `/daily-cars/${officeId}/${carId}`,
      );

      if (!response.result) {
        throw new Error(response.message || "فشل في جلب تفاصيل السيارة");
      }

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching daily car details:", error);
      throw error;
    }
  }

  static async getMonthlyCarDetails(
    officeId: number,
    carId: number,
  ): Promise<CarDetailsResponse> {
    console.log(`📡 Fetching: /monthly-companies/${officeId}/${carId}`);
    try {
      const response = await this.get<ApiResponse<CarDetailsResponse>>(
        `/monthly-companies/${officeId}/${carId}`,
      );

      console.log("✅ Response:", response);

      if (!response.result) {
        throw new Error(
          response.message || "فشل في جلب تفاصيل السيارة الشهرية",
        );
      }

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching monthly car details:", error);
      throw error;
    }
  }
  static async getAvailablePeriods(
    carId: number,
    officeId: number,
    bookingType: "daily" | "monthly" = "daily",
  ): Promise<AvailablePeriodsResponse> {
    try {
      const response = await this.get<ApiResponse<AvailablePeriodsResponse>>(
        `/available-periods/car/${carId}?booking_type=${bookingType}&rental_company_id=${officeId}`,
      );

      if (!response.result) {
        throw new Error(
          response.message || "Failed to fetch available periods",
        );
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching available periods:", error);
      throw error;
    }
  }
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response =
        await this.get<ApiResponse<PaymentMethodsResponse>>("/payment-methods");

      if (!response.result) {
        throw new Error(response.message || "Failed to fetch payment methods");
      }

      return response.data.services.filter(
        (method) => method.status === "active",
      );
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw error;
    }
  }
  static async calculatePrice(
    params: CalculatePriceRequest,
  ): Promise<CalculatePriceResponse> {
    try {
      const requestBody: any = {
        booking_type: params.booking_type,
        rental_company_id: params.rental_company_id,
        start_date: params.start_date,
        total_days: params.total_days,
        car_id: params.car_id,
        start_time: params.start_time,
      };

      if (params.additional_services && params.additional_services.length > 0) {
        requestBody.additional_services = params.additional_services;
      }

      const response = await this.post<ApiResponse<CalculatePriceResponse>>(
        "/bookings/calculate-price",
        requestBody,
      );

      if (!response.result) {
        throw new Error(response.message || "Failed to calculate price");
      }

      return response.data;
    } catch (error) {
      console.error("Error calculating price:", error);
      throw error;
    }
  }
  static async getSliders(): Promise<SliderResponse> {
    try {
      const response =
        await this.get<ApiResponse<SliderResponse>>("/user/sliders");

      if (!response.result) {
        throw new Error(response.message || "Failed to fetch sliders");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching sliders:", error);
      throw error;
    }
  }

  static async createBooking(
    params: CreateBookingRequest,
    token: string,
  ): Promise<CreateBookingResponse> {
    try {
      
      const requestBody = {
        category_id: params.category_id || 1,
        zip: params.zip || "RHSB7908",
        delivery_latitude: params.delivery_latitude || 24.7136,
        rental_company_id: params.rental_company_id,
        start_time: params.start_time || "16:00",
        city: params.city || "الرياض",
        booking_type: params.booking_type || "daily",
        delivery_longitude: params.delivery_longitude || 46.6953,
        additional_services: params.additional_services || [],
        uuid: params.uuid || crypto.randomUUID(),
        delivery_type: params.delivery_type || "to_location",
        total_days: params.total_days || 1,
        car_id: params.car_id,
        payment_method_id: params.payment_method_id,
        index: params.index || 1,
        start_date: params.start_date,
        delivery_address: params.delivery_address || "",
        insurance_type_id: params.insurance_type_id || 4,
        address: params.address || "",
        amount: params.amount || 0,
      };

      

      const response = await this.post<ApiResponse<CreateBookingResponse>>(
        "/bookings",
        requestBody,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      );

      if (!response.result) {
        throw new Error(response.message || "فشل إنشاء الحجز");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

// src/services/carService.ts

static async checkout(
  params: CheckoutRequest,
  token: string
): Promise<{ payment_url: string; payment_data?: any }> {
  try {
    const requestBody = {
      car_name: params.car_name,
      amount: params.amount,
      index: params.index,
      uuid: params.uuid,
      zip: params.zip || '12251',
      payment_method: params.payment_method,
      address: params.address,
      city: params.city || 'الرياض',
    };

    console.log('📤 Checkout Request:', requestBody);

    const response = await this.post<ApiResponse<any>>(
      '/pay/checkout',
      requestBody,
      {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    );

    console.log('📥 Full Checkout Response:', JSON.stringify(response, null, 2));

    if (!response.result) {
      throw new Error(response.message || 'فشل عملية الدفع');
    }

    let paymentUrl = '';
    const paymentData = response.data?.payment || response.data;

    // ✅ 1. أولاً: التحقق من Tabby (installments)
    if (paymentData?.configuration?.available_products?.installments) {
      const installments = paymentData.configuration.available_products.installments;
      if (installments.length > 0 && installments[0]?.web_url) {
        paymentUrl = installments[0].web_url;
        console.log('🔗 Tabby Payment URL (from installments):', paymentUrl);
      }
    }

    // ✅ 2. التحقق من web_url مباشر (Tabby)
    if (!paymentUrl && paymentData?.web_url) {
      paymentUrl = paymentData.web_url;
      console.log('🔗 Tabby web_url:', paymentUrl);
    }

    // ✅ 3. التحقق من checkout_url (Tamara)
    if (!paymentUrl && paymentData?.checkout_url) {
      paymentUrl = paymentData.checkout_url;
      console.log('🔗 Tamara checkout_url:', paymentUrl);
    }

    // ✅ 4. بناء رابط Paymob من client_secret (فيزا/ماستر/مدى/ابل باي)
    if (!paymentUrl) {
      const clientSecret = paymentData?.client_secret || response.data?.client_secret;
      if (clientSecret) {
        // ✅ استخدم public key المناسب
        const publicKey = 'sau_pk_live_8Dza5gChMSVJbnsKtWKJOTs8jlQz6ZEW'; // Live Key
        // للاختبار استخدم: 'sau_pk_test_SCltAxh7OTxzJ5ydtfIhJstUARoCOekt'
        paymentUrl = `https://ksa.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${clientSecret}`;
        console.log('🔗 Paymob URL (built from client_secret):', paymentUrl);
      }
    }

    // ✅ 5. التحقق من payment_keys (كحل أخير)
    if (!paymentUrl && paymentData?.payment_keys && paymentData.payment_keys.length > 0) {
      const firstKey = paymentData.payment_keys[0];
      // ❌ لا تستخدم redirection_url لأنه رابط POST
      // ✅ استخدم client_secret بدلاً منه
      if (paymentData.client_secret) {
        const publicKey = 'sau_pk_live_8Dza5gChMSVJbnsKtWKJOTs8jlQz6ZEW';
        paymentUrl = `https://ksa.paymob.com/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${paymentData.client_secret}`;
        console.log('🔗 Paymob URL (from payment_keys fallback):', paymentUrl);
      }
    }

    // ✅ 6. التحقق من redirect_url (كحل أخير)
    if (!paymentUrl && paymentData?.redirect_url) {
      paymentUrl = paymentData.redirect_url;
      console.log('🔗 redirect_url:', paymentUrl);
    }

    // ✅ 7. التحقق من payment_url مباشر
    if (!paymentUrl && response.data?.payment_url) {
      paymentUrl = response.data.payment_url;
      console.log('🔗 payment_url:', paymentUrl);
    }

    console.log('🔗 Final Payment URL:', paymentUrl);

    if (!paymentUrl) {
      console.error('❌ No payment URL found in response');
      throw new Error('لم يتم العثور على رابط الدفع');
    }

    return {
      payment_url: paymentUrl,
      payment_data: paymentData,
    };
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
}
}
