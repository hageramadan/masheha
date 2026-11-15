export interface PhoneCredentials {
  country_code: string;
  phone: string;
}

export interface RegistrationData extends PhoneCredentials {
  email: string;
  date_of_birth: string;
  license_number: string;
}

export interface AuthUser {
  token?: string;
  phone?: string;
  country_code?: string;
  [key: string]: unknown;
}

interface AuthResponse {
  result: boolean;
  message?: string;
  data?: { user?: AuthUser; token?: string };
}

export function normalizePhone(credentials: PhoneCredentials): PhoneCredentials {
  return {
    country_code: credentials.country_code.trim(),
    phone: credentials.phone.replace(/\D/g, '').replace(/^0/, ''),
  };
}

export class AuthService {
  private static async post(endpoint: string, fields: Record<string, string>): Promise<AuthResponse> {
    const body = new FormData();
    Object.entries(fields).forEach(([key, value]) => body.append(key, value));
    const response = await fetch(`https://admin.masheha.com/api/user/${endpoint}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'accept-language': 'ar' },
      body,
    });
    const data = await response.json();
    if (!response.ok || data.result !== true) {
      const validationError = data.errors && Object.values(data.errors).flat().find((value) => typeof value === 'string');
      throw new Error(validationError || (typeof data.message === 'string' && data.message) || 'تعذر إتمام الطلب، حاول مرة أخرى');
    }
    return data;
  }

  static register(data: RegistrationData) {
    return this.post('register', {
      ...normalizePhone(data),
      email: data.email.trim(),
      date_of_birth: data.date_of_birth,
      license_number: data.license_number.trim(),
    });
  }

  static verifyOtp(credentials: PhoneCredentials, otp: string) {
    if (!/^\d{4}$/.test(otp)) throw new Error('يرجى إدخال رمز التحقق المكون من 4 أرقام');
    return this.post('verify/otp', { ...normalizePhone(credentials), otp });
  }

  static resendOtp(credentials: PhoneCredentials) {
    return this.post('resend/otp', { ...normalizePhone(credentials) });
  }
}
