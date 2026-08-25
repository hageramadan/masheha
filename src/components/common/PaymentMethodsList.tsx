// src/components/common/PaymentMethodsList.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { useState, useEffect } from "react";
import { CarService } from "@/src/services/carService";
import toast from "react-hot-toast";

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
  description?: string;
}

interface PaymentMethodsListProps {
  selectedMethod: string | null;
  onSelect: (id: string) => void;
  error?: string;
  rentalType?: "يومي" | "شهري";
  onMethodsLoaded?: (methods: PaymentMethod[]) => void;
}

export default function PaymentMethodsList({
  selectedMethod,
  onSelect,
  error,
  rentalType = "يومي",
  onMethodsLoaded,
}: PaymentMethodsListProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setIsLoading(true);
        const methods = await CarService.getPaymentMethods();

        let filteredMethods = methods.map((method) => ({
          id: String(method.id),
          name: method.name,
          image: method.image  || "/images/payment/visa.png",
          // description: method.description,
        }));

        if (rentalType === "يومي") {
          filteredMethods = filteredMethods.filter(
            (method) =>
              method.name.toLowerCase() !== "دفع نقدي بعد توصيل السيارة",
          );
        }

        setPaymentMethods(filteredMethods);
        
        if (onMethodsLoaded) {
          onMethodsLoaded(filteredMethods);
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
        toast.error("حدث خطأ في تحميل طرق الدفع");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [rentalType, onMethodsLoaded]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4">
        لا توجد طرق دفع متاحة حالياً
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => {
        const isSelected = selectedMethod === method.id;

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={cn(
              "w-full flex items-center gap-2 p-4 rounded-xl border transition-all duration-100 text-right",
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-gray-200 hover:border-primary/30 hover:bg-gray-50",
            )}
          >
            <div className="w-14 h-10 shrink-0 flex items-center justify-center">
              <Image
                src={method.image}
                alt={method.name}
                width={400}
                height={400}
                className="object-contain w-full h-full"
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/payment/visa.png";
                }}
              />
            </div>

            <div className="flex-1">
              <span className="font-medium text-gray-800">{method.name}</span>
              {method.description && (
                <p className="text-xs text-gray-500">{method.description}</p>
              )}
            </div>

            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-gray-300 bg-white",
              )}
            >
              {isSelected && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              )}
            </div>
          </button>
        );
      })}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}