// src/components/booking/BookingPayment.tsx

"use client";


import PaymentMethodsList from "@/src/components/common/PaymentMethodsList";

interface BookingPaymentProps {
  selectedMethod: string | null;
  onSelect: (id: string) => void;
  error?: string;
  rentalType?: "يومي" | "شهري";
}

export default function BookingPayment({
  selectedMethod,
  onSelect,
  error,
  rentalType = "يومي",
}: BookingPaymentProps) {
  return (
    <div className="bg-[#FCF9F466] rounded-lg border p-3 lg:p-5 space-y-4">
      <h2 className="text-base lg:text-lg font-bold text-primary mb-4">
        طريقة الدفع
      </h2>

      <PaymentMethodsList
        selectedMethod={selectedMethod}
        onSelect={onSelect}
        error={error}
        rentalType={rentalType}
      />
    </div>
  );
}