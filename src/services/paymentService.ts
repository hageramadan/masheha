// src/services/paymentService.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CarService } from "./carService";

// تعريف أنواع طرق الدفع
export enum PaymentMethodType {
  APPLE_PAY = 1,
  VISA = 6,
  MADA = 8,
  TABBY = 10,
  TAMARA = 11,
  CASH = 13,
  MISPAY = 14,
}

// تعريف الـ Index لكل طريقة دفع
export const PaymentMethodIndex: Record<PaymentMethodType, number> = {
  [PaymentMethodType.APPLE_PAY]: 0,
  [PaymentMethodType.VISA]: 1,
  [PaymentMethodType.MADA]: 1,
  [PaymentMethodType.TABBY]: 2,
  [PaymentMethodType.TAMARA]: 3,
  [PaymentMethodType.CASH]: 13,
  [PaymentMethodType.MISPAY]: 4,
};

// تعريف أسماء طرق الدفع
export const PaymentMethodNames: Record<PaymentMethodType, string> = {
  [PaymentMethodType.APPLE_PAY]: "Apple Pay",
  [PaymentMethodType.VISA]: "Visa / Mastercard",
  [PaymentMethodType.MADA]: "مدى",
  [PaymentMethodType.TABBY]: "Tabby",
  [PaymentMethodType.TAMARA]: "Tamara",
  [PaymentMethodType.CASH]: "دفع نقدي",
  [PaymentMethodType.MISPAY]: "MISPay",
};

// المفاتيح العامة لـ Paymob
const PAYMOB_PUBLIC_KEYS = {
  SAU_LIVE: 'sau_pk_live_uIsTYNAhY7ONDAtd6eYycGxZHCIe58mH',
  SAU_TEST: 'sau_pk_live_uIsTYNAhY7ONDAtd6eYycGxZHCIe58mH',
  EGY_LIVE: 'egy_pk_live_cZxW9YgHkLmNpQrStUvWxYz1234567890',
  EGY_TEST: 'egy_pk_test_wooiLbVXlhiRY1W6vj7iPI7RZaHSDwbA',
};

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const COUNTRY = process.env.NEXT_PUBLIC_COUNTRY || 'SAU';

function getPaymobPublicKey(): string {
  if (COUNTRY === 'EGY') {
    return IS_PRODUCTION ? PAYMOB_PUBLIC_KEYS.EGY_LIVE : PAYMOB_PUBLIC_KEYS.EGY_TEST;
  }
  return IS_PRODUCTION ? PAYMOB_PUBLIC_KEYS.SAU_LIVE : PAYMOB_PUBLIC_KEYS.SAU_TEST;
}

interface PaymentData {
  car_name: string;
  amount: number;
  uuid: string;
  zip: string;
  address: string;
  city: string;
  payment_method: PaymentMethodType;
  return_url?: string;
  booking_id?: number;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  message: string;
  isCash?: boolean;
}

export class PaymentService {
  static async processPayment(
    data: PaymentData,
    token: string
  ): Promise<PaymentResponse> {
    const { payment_method, ...restData } = data;

    if (payment_method === PaymentMethodType.CASH) {
      return {
        success: true,
        message: "تم اختيار الدفع النقدي عند الاستلام",
        isCash: true,
      };
    }

    try {
      const index = PaymentMethodIndex[payment_method];

      const checkoutData = {
        ...restData,
        payment_method,
        index,
      };

      console.log(`📤 Processing payment with method: ${PaymentMethodNames[payment_method]}`);
      console.log(`📤 Index: ${index}, Payment Method ID: ${payment_method}`);

      const response = await CarService.checkout(checkoutData, token);
      console.log(`📥 Payment response:`, response);

      let paymentUrl = this.buildPaymentUrl(payment_method, response);

      if (!paymentUrl) {
        return {
          success: false,
          message: "لم يتم استلام رابط الدفع",
        };
      }

      if (data.return_url) {
        const separator = paymentUrl.includes('?') ? '&' : '?';
        paymentUrl += `${separator}return_url=${encodeURIComponent(data.return_url)}`;
        if (data.booking_id) {
          paymentUrl += `&booking_id=${data.booking_id}`;
        }
        if (data.uuid) {
          paymentUrl += `&uuid=${data.uuid}`;
        }
        if (payment_method) {
          paymentUrl += `&payment_method_id=${payment_method}`;
        }
      }

      return {
        success: true,
        paymentUrl,
        message: "تم توجيهك لبوابة الدفع",
        isCash: false,
      };
    } catch (error: any) {
      console.error("❌ Error processing payment:", error);
      return {
        success: false,
        message: error.message || "حدث خطأ أثناء عملية الدفع",
      };
    }
  }

  private static buildPaymentUrl(
    paymentMethod: PaymentMethodType,
    response: any
  ): string | null {
    const paymentData = response.payment_data || response;

    switch (paymentMethod) {
      case PaymentMethodType.APPLE_PAY:
      case PaymentMethodType.VISA:
      case PaymentMethodType.MADA:
        return this.buildPaymobUrl(paymentData);
      case PaymentMethodType.TABBY:
        return this.buildTabbyUrl(paymentData);
      case PaymentMethodType.TAMARA:
        return this.buildTamaraUrl(paymentData);
      case PaymentMethodType.MISPAY:
        return this.buildMispayUrl(paymentData);
      default:
        return this.buildFallbackUrl(paymentData);
    }
  }

  private static buildPaymobUrl(paymentData: any): string | null {
    const clientSecret = paymentData?.client_secret || 
                        paymentData?.clientSecret || 
                        paymentData?.payment?.client_secret;

    if (!clientSecret) {
      console.warn(' No client_secret found in response');
      return null;
    }

    const publicKey = getPaymobPublicKey();
    let baseUrl: string;
    if (COUNTRY === 'EGY') {
      baseUrl = 'https://eg.checkout.paymob.com';
    } else {
      baseUrl = 'https://ksa.paymob.com/unifiedcheckout';
    }

    const paymentUrl = `${baseUrl}/?publicKey=${publicKey}&clientSecret=${clientSecret}`;
    console.log(`🔗 Paymob URL: ${paymentUrl}`);
    return paymentUrl;
  }

  private static buildTabbyUrl(paymentData: any): string | null {
    if (paymentData?.configuration?.available_products?.installments) {
      const installments = paymentData.configuration.available_products.installments;
      if (installments.length > 0 && installments[0]?.web_url) {
        return installments[0].web_url;
      }
    }
    if (paymentData?.web_url) {
      return paymentData.web_url;
    }
    if (paymentData?.payment?.web_url) {
      return paymentData.payment.web_url;
    }
    return null;
  }

  private static buildTamaraUrl(paymentData: any): string | null {
    if (paymentData?.checkout_url) {
      return paymentData.checkout_url;
    }
    if (paymentData?.payment_url) {
      return paymentData.payment_url;
    }
    if (paymentData?.payment?.checkout_url) {
      return paymentData.payment.checkout_url;
    }
    return null;
  }

  private static buildMispayUrl(paymentData: any): string | null {
    if (paymentData?.checkout_url) {
      return paymentData.checkout_url;
    }
    if (paymentData?.raw?.result?.url) {
      return paymentData.raw.result.url;
    }
    if (paymentData?.payment_url) {
      return paymentData.payment_url;
    }
    if (paymentData?.result?.url) {
      return paymentData.result.url;
    }
    if (paymentData?.payment?.checkout_url) {
      return paymentData.payment.checkout_url;
    }
    if (paymentData?.raw?.url) {
      return paymentData.raw.url;
    }
    console.warn(' No Mispay URL found in response');
    return null;
  }

  private static buildFallbackUrl(paymentData: any): string | null {
    const possibleUrls = [
      paymentData?.payment_url,
      paymentData?.checkout_url,
      paymentData?.web_url,
      paymentData?.redirect_url,
      paymentData?.redirection_url,
      paymentData?.payment?.payment_url,
      paymentData?.payment?.checkout_url,
      paymentData?.payment?.web_url,
      paymentData?.raw?.result?.url,
      paymentData?.result?.url,
      paymentData?.configuration?.available_products?.installments?.[0]?.web_url,
      paymentData?.payment_keys?.[0]?.redirection_url,
    ];

    for (const url of possibleUrls) {
      if (url && typeof url === 'string' && url.startsWith('http')) {
        return url;
      }
    }
    return null;
  }

  static isPaymentMethodRequiresGateway(methodId: number): boolean {
    return methodId !== PaymentMethodType.CASH;
  }

  static isPaymentMethodInstallment(methodId: number): boolean {
    return methodId === PaymentMethodType.TABBY || 
           methodId === PaymentMethodType.TAMARA;
  }

  static getPaymentMethodName(methodId: number): string {
    return PaymentMethodNames[methodId as PaymentMethodType] || 'غير معروف';
  }

  static getPaymentMethodIndex(methodId: number): number {
    return PaymentMethodIndex[methodId as PaymentMethodType] || 0;
  }
}

export { getPaymobPublicKey, PAYMOB_PUBLIC_KEYS };