// src/services/updatePaymentStatusService.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

interface UpdatePaymentStatusParams {
  order_uuid: string;
  payment_status: string;
  payment_method_id: number;
  response?: Record<string, any>;
}

interface UpdatePaymentStatusResponse {
  result: boolean;
  errNum: number;
  message: string;
  data?: any;
}

export class UpdatePaymentStatusService {
  private static baseURL: string = 'https://admin.masheha.com/api';

  static async updatePaymentStatus(
    params: UpdatePaymentStatusParams,
    token: string
  ): Promise<boolean> {
    // ✅ التحقق من وجود UUID
    if (!params.order_uuid || params.order_uuid.trim().length === 0) {
      console.error('❌ UUID is empty');
      return false;
    }

    try {
      // ✅ إعداد المعاملات
      const parameters: Record<string, any> = {
        order_uuid: params.order_uuid,
        payment_status: params.payment_status,
        payment_method_id: params.payment_method_id,
      };

      if (params.response) {
        parameters.response = params.response;
      }

      console.log('📤 Updating payment status with params:', parameters);

      // ✅ استدعاء الـ API
      const response = await fetch(
        `${this.baseURL}/orders/update-payment-status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            "accept-language": "ar",
          },
          body: JSON.stringify(parameters),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: UpdatePaymentStatusResponse = await response.json();
      console.log('📥 Update payment status response:', data);

     
      if (data.result === true) {
        console.log('✅ Payment status updated successfully (result: true)');
        return true;
      }
      
      // 2. errNum === 200 (نجاح)
      if (data.errNum === 200) {
        console.log('✅ Payment status updated successfully (errNum: 200)');
        return true;
      }

      // 3. وجود data (يعني نجاح)
      if (data.data !== undefined && data.data !== null) {
        console.log('✅ Payment status updated successfully (data exists)');
        return true;
      }

      // 4. الرسالة تحتوي على "success" أو "تم" أو "نجاح"
      if (data.message) {
        const successKeywords = ['success', 'تم', 'نجاح', 'successfully', 'updated'];
        const messageLower = data.message.toLowerCase();
        if (successKeywords.some(keyword => messageLower.includes(keyword))) {
          console.log('✅ Payment status updated successfully (message contains success keyword)');
          return true;
        }
      }

      // ❌ فشل التحديث
      console.error('❌ Update failed:', data.message || 'Unknown error');
      return false;
      
    } catch (error: any) {
      console.error('❌ Error updating payment status:', error);
      return false;
    }
  }

  static async updatePaymentSuccess(
    uuid: string,
    paymentMethodId: number,
    response?: Record<string, any>,
    token?: string
  ): Promise<boolean> {
    if (!token) {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        console.error('❌ No token found');
        return false;
      }
      token = storedToken;
    }

    return this.updatePaymentStatus(
      {
        order_uuid: uuid,
        payment_status: 'success',
        payment_method_id: paymentMethodId,
        response,
      },
      token
    );
  }

  static async updatePaymentFailed(
    uuid: string,
    paymentMethodId: number,
    response?: Record<string, any>,
    token?: string
  ): Promise<boolean> {
    if (!token) {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        console.error('❌ No token found');
        return false;
      }
      token = storedToken;
    }

    return this.updatePaymentStatus(
      {
        order_uuid: uuid,
        payment_status: 'failed',
        payment_method_id: paymentMethodId,
        response,
      },
      token
    );
  }

  static async updatePaymentPending(
    uuid: string,
    paymentMethodId: number,
    response?: Record<string, any>,
    token?: string
  ): Promise<boolean> {
    if (!token) {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        console.error('❌ No token found');
        return false;
      }
      token = storedToken;
    }

    return this.updatePaymentStatus(
      {
        order_uuid: uuid,
        payment_status: 'pending',
        payment_method_id: paymentMethodId,
        response,
      },
      token
    );
  }
}