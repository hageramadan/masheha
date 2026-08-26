// app/api/payment-webhook/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { UpdatePaymentStatusService } from "@/src/services/updatePaymentStatusService";

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ استقبال البيانات من Webhook
    const body = await request.json();

    console.log("📥 Webhook received:", body);

    // 2️⃣ استخراج البيانات
    const {
      order_uuid,
      payment_status,
      payment_method_id,
      transaction_id,
      reference_id,
      response_code,
      response_message,
      ...rest
    } = body;

    // 3️⃣ التحقق من البيانات الأساسية
    if (!order_uuid || !payment_method_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 4️⃣ الحصول على التوكن من الـ headers
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") || "";

    if (!token) {
      console.warn("⚠️ No token provided in webhook");
    }

    // 5️⃣ بناء response كامل
    const paymentResponse = {
      transaction_id,
      reference_id,
      response_code,
      response_message,
      webhook_data: rest,
    };

    // 6️⃣ تحديث حالة الدفع
    const isUpdated = await UpdatePaymentStatusService.updatePaymentStatus(
      {
        order_uuid,
        payment_status: payment_status || "success",
        payment_method_id: parseInt(payment_method_id),
        response: paymentResponse,
      },
      token,
    );

    if (isUpdated) {
      return NextResponse.json({
        result: true,
        message: "Payment status updated successfully",
      });
    } else {
      return NextResponse.json(
        { result: false, message: "Failed to update payment status" },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}