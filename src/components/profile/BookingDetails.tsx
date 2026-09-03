// src/components/profile/BookingDetails.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaCar,
  FaCity,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaCreditCard,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";
import { PiCalendarBlank } from "react-icons/pi";
import { cn } from "@/src/lib/utils";
import {
  getBookingDetails,
  checkExtension,
} from "@/src/services/bookingApiService";
import { BookingDetail } from "@/src/types/api";
import {
  PaymentService,
  PaymentMethodType,
} from "@/src/services/paymentService";
import { UpdatePaymentStatusService } from "@/src/services/updatePaymentStatusService";
import toast from "react-hot-toast";
import ExtendBooking from "./ExtendBooking";
import PaymentMethodsList from "@/src/components/common/PaymentMethodsList";
import { RxCalendar } from "react-icons/rx";
import { MdOutlinePayment } from "react-icons/md";
import { FaMoneyBills } from "react-icons/fa6";
import { RiCameraSwitchLine } from "react-icons/ri";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaPercent } from "react-icons/fa";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { FaUser } from "react-icons/fa";
interface BookingDetailsProps {
  bookingId: number;
  onBack: () => void;
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function getPaymentStatusColor(status: string) {
  return status === "paid"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";
}

function getPaymentStatusLabel(status: string) {
  return status === "paid" ? "مدفوع" : "غير مدفوع";
}

export default function BookingDetails({
  bookingId,
  onBack,
}: BookingDetailsProps) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [showExtend, setShowExtend] = useState(false);
  const [canExtend, setCanExtend] = useState(false);
  const [extensionData, setExtensionData] = useState<any>(null);
  const [isCheckingExtension, setIsCheckingExtension] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  async function checkExtensionAvailability(bookingId: number) {
    setIsCheckingExtension(true);
    try {
      const data = await checkExtension(bookingId);
      setCanExtend(data.can_extend);
      setExtensionData(data);
    } catch (error) {
      console.error("Error checking extension:", error);
      setCanExtend(false);
    } finally {
      setIsCheckingExtension(false);
    }
  }

  useEffect(() => {
    async function fetchBookingDetails() {
      setLoading(true);
      setError(null);
      try {
        const response = await getBookingDetails(bookingId);
        if (response.result && response.data) {
          setBooking(response.data);
          await checkExtensionAvailability(response.data.id);
        } else {
          setError(response.message || "حدث خطأ في جلب تفاصيل الحجز");
        }
      } catch (err) {
        setError("حدث خطأ في الاتصال بالخادم");
        console.error("Error fetching booking details:", err);
      } finally {
        setLoading(false);
      }
    }

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const handleRepayment = async () => {
    if (!selectedPaymentMethod || !booking) return;

    setIsProcessingPayment(true);
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        toast.error("الرجاء تسجيل الدخول أولاً");
        return;
      }

      const paymentMethodId = parseInt(selectedPaymentMethod);

      const updatePending =
        await UpdatePaymentStatusService.updatePaymentPending(
          booking.uuid,
          paymentMethodId,
          undefined,
          token,
        );

      if (!updatePending) {
        toast.error("حدث خطأ في تحديث حالة الدفع");
        return;
      }

      const returnUrl = `${window.location.origin}/profile?tab=bookings&booking_id=${booking.id}&payment_status=success&uuid=${booking.uuid}&payment_method_id=${paymentMethodId}`;

      const result = await PaymentService.processPayment(
        {
          car_name: booking.car.name,
          amount: parseFloat(booking.total_amount),
          uuid: booking.uuid,
          zip: booking.zip || "12251",
          address: booking.address || "",
          city: booking.city || "الرياض",
          payment_method: paymentMethodId,
          return_url: returnUrl,
          booking_id: booking.id,
        },
        token,
      );

      if (result.success) {
        if (result.isCash) {
          await UpdatePaymentStatusService.updatePaymentSuccess(
            booking.uuid,
            paymentMethodId,
            { payment_type: "cash" },
            token,
          );

          toast.success("تم اختيار الدفع النقدي عند الاستلام");
          setShowPaymentPopup(false);
          setSelectedPaymentMethod(null);

          setTimeout(() => {
            window.location.href = "/profile?tab=bookings";
          }, 1500);
        } else if (result.paymentUrl) {
          window.open(result.paymentUrl, "_blank");
          toast.success("تم توجيهك لبوابة الدفع");
          setShowPaymentPopup(false);
          setSelectedPaymentMethod(null);
        } else {
          await UpdatePaymentStatusService.updatePaymentFailed(
            booking.uuid,
            paymentMethodId,
            { error: "No payment URL received" },
            token,
          );
          toast.error("لم يتم استلام رابط الدفع");
        }
      } else {
        await UpdatePaymentStatusService.updatePaymentFailed(
          booking.uuid,
          paymentMethodId,
          { error: result.message },
          token,
        );
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);

      if (booking && selectedPaymentMethod) {
        await UpdatePaymentStatusService.updatePaymentFailed(
          booking.uuid,
          parseInt(selectedPaymentMethod),
          { error: error.message || "Unexpected error" },
          token || undefined,
        );
      }

      toast.error(error.message || "حدث خطأ أثناء عملية الدفع");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
    setSelectedPaymentMethod(null);
  };

  const handleExtend = () => {
    setShowExtend(true);
  };

  const handleExtendBack = () => {
    setShowExtend(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#012738] border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500">{error || "لم يتم العثور على الحجز"}</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-[#012738] text-white rounded-lg hover:bg-[#012738]/90 transition-colors"
          >
            العودة إلى القائمة
          </button>
        </div>
      </div>
    );
  }

  if (showExtend) {
    return (
      <ExtendBooking
        bookingId={booking.id}
        bookingNumber={booking.identification_number}
        carName={`${booking.car.brand.name} ${booking.car.name}`}
        returnDate={booking.end_date}
        rentalDays={booking.total_days}
        dailyPrice={extensionData?.daily_price || 0}
        tax={extensionData?.tax || "0"}
        maxExtensionDays={extensionData?.max_extension_days || 30}
        onBack={handleExtendBack}
      />
    );
  }

  const isPaymentPending = booking.payment_status !== "paid";
  const isPaymentPaid = booking.payment_status === "paid";

  return (
    <div className="bg-white min-h-screen">
      <button
        onClick={onBack}
        className={cn(
          "flex items-center gap-2 text-gray-600 hover:text-[#012738] transition-colors py-4",
          "transform transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
        )}
      >
        <FaArrowRight className="text-lg" />
        <span className="text-base lg:text-lg font-medium">تفاصيل الحجز</span>
      </button>

      <div
        className={cn(
          "bg-[#FCF9F466] border p-3 lg:p-5 rounded-lg space-y-6",
          "transform transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-4 shadow p-3 rounded-2xl",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="w-28 h-24 lg:w-32 lg:h-28 shrink-0 overflow-hidden rounded-xl">
            {booking.car.image ? (
              <Image
                src={booking.car.image}
                alt={booking.car.name}
                width={128}
                height={112}
                className="object-contain w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FaCar className="h-12 w-12" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-base lg:text-lg truncate">
                  {booking.car.brand.name} {booking.car.name}
                </p>
                <p className="text-xs text-gray-500">
                  {booking.car.model_year}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-sm lg:text-xl font-bold text-[#012738]">
                  {booking.total_amount}
                </span>
                <Image
                  src="/images/SAR.png"
                  alt="ريال"
                  width={20}
                  height={20}
                  className="w-4 h-4 lg:w-5 lg:h-5"
                />
              </div>
            </div>
            {booking.delivery_address && (
              <div className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
                <p>يتم التوصيل في</p>
                <span>{booking.address}</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "space-y-4 bg-[#FCF9F466] border p-3 lg:p-5 rounded-lg",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "150ms" }}
        >
          <div className="flex items-center gap-1 lg:gap-2">
            <div className="shadow shadow-[#0000001A] p-2  rounded-full">
              <RxCalendar className="w-5 h-5 text-[#012738] " />
            </div>

            <h3 className="text-base font-bold text-[#1F2937]">تاريخ الحجز</h3>
          </div>

          {/* import { RxCalendar } from "react-icons/rx"; */}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#4F5352]">مدة الحجز</p>
              <p className="text-sm font-bold text-[#012738]">
                {booking.total_days} يوم
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between gap-0.5">
                  <div className="flex items-center gap-1">
                    <div className=" p-1  rounded-full">
                      <PiCalendarBlank className="w-4 h-4 text-[#012738]" />
                    </div>

                    <p className="text-sm font-bold text-[#4F5352]">
                      تاريخ الاستلام
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#012738]">
                    {formatDate(booking.start_date)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <div className=" p-1  rounded-full">
                      <PiCalendarBlank className="w-4 h-4 text-[#012738]" />
                    </div>

                    <p className="text-sm font-bold text-[#4F5352]">
                      تاريخ الإرجاع
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#012738]">
                    {formatDate(booking.end_date)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center h-full">
                <div className="flex-1 w-px bg-[#012738] min-h-3"></div>
                <div className="w-2 h-2 rounded-full bg-[#012738]"></div>
                <div className="flex-1 w-px bg-[#012738] min-h-6"></div>
                <div className="w-2 h-2 rounded-full bg-[#012738] "></div>
                <div className="flex-1 w-px bg-[#012738] min-h-3"></div>
              </div>
            </div>

            <p className=" text-xs font-bold text-center text-[#757575] pt-3">
              عند انتهاء الحجز يرجى تسليم السيارة او تمديد الحجز
            </p>
          </div>
        </div>
        <div
          className={cn(
            "space-y-3 bg-[#FCF9F466] border p-3 lg:p-5 rounded-lg",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "300ms" }}
        >
          <div className="flex items-center gap-1 lg:gap-2">
            <div className="shadow shadow-[#0000001A] p-2  rounded-full">
              <MdOutlinePayment className="w-5 h-5 text-[#012738] " />
            </div>

            <h3 className="text-base font-bold text-[#191C1F]">تفاصيل الدفع</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                  <div className="p-1 rounded-full">
                    <FaMoneyBills className="w-5 h-5 text-[#012738] " />
                  </div>

                   <span className="text-gray-600">السعر الأساسي</span>
                </div>
            
              <div className="flex items-center gap-1">
                <span className="font-bold text-[#717182] text-sm">
                  {booking.price_breakdown.base_price}
                </span>
                <span className="text-[#717182] text-sm font-bold">ريال</span>
              </div>
            </div>

            {parseFloat(booking.discount_amount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الخصم</span>
                <div className="flex items-center gap-1 text-green-600">
                  <span className="font-bold">-{booking.discount_amount}</span>
                  <Image
                    src="/images/SAR.png"
                    alt="ريال"
                    width={16}
                    height={16}
                    className="w-3 h-3"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-1">
                <div className="p-1 rounded-full">
                  <FaPercent className="w-5 h-5 text-[#012738] " />
                </div>

                <span className="text-gray-600">ضريبة القيمة المضافة</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-bold text-[#717182] text-sm ">
                  {booking.price_breakdown.tax}
                </span>
                <span className="text-[#717182] text-sm font-bold">ريال</span>
              </div>
            </div>

            {parseFloat(booking.additional_services_total_price) > 0 && (
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <div className="p-1 rounded-full">
                    <LiaMoneyBillWaveSolid className="w-5 h-5 text-[#012738] " />
                  </div>

                  <span className="text-gray-600">رسوم الخدمات الاضافية</span>
                </div>

                <div className="flex items-center gap-1 text-[#717182] text-sm font-bold">
                  <span className="text-[#717182] text-sm font-bold">
                    {booking.additional_services_total_price}
                  </span>
                   <span className="text-[#717182] text-sm font-bold">ريال</span>
                </div>
              </div>
            )}

            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span className="text-[#0079AB] text-base font-bold">الإجمالي</span>
              <div className="flex items-center gap-1">
                <span className="text-base text-[#0079AB]">
                  {booking.price_breakdown.total}
                </span>
                <span className="text-[#0079AB] text-base font-bold">ريال</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "space-y-3 bg-[#FCF9F466] border p-3 lg:p-5 rounded-lg",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "250ms" }}
        >
          <h3 className="text-base font-bold text-[#191C1F]">طريقة الاستلام</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="h-4 w-4 text-[#012738] mt-0.5" />
              <div>
                <p className="font-bold text-sm text-[#191C1F]">
                  {booking.delivery_type === "to_location"
                    ? "توصيل الي موقعك الحالي"
                    : "استلام من الفرع"}
                </p>
                {booking.delivery_address && (
                  <p className="text-sm text-gray-500">
                    {booking.delivery_address}
                  </p>
                )}
              
              
              </div>
            </div>
          </div>
        </div>
   {/* قسم بيانات العميل */}
<div
  className={cn(
    "space-y-3 bg-[#FCF9F466] border p-3 lg:p-5 rounded-lg",
    "transform transition-all duration-500 ease-out",
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
  )}
  style={{ transitionDelay: "275ms" }}
>
  <div className="flex items-center gap-1 lg:gap-2">
    <div className="shadow-lg shadow-[#0000001A] p-2 rounded-full">
      <FaUser className="w-5 h-5 text-[#012738]" />
    </div>
    <h3 className="text-base font-bold text-[#191C1F]">بيانات العميل</h3>
  </div>
  <div className="grid grid-cols-2 gap-3">
    <div className="flex flex-col justify-between gap-1 text-sm">
      <span className="text-gray-600">الاسم</span>
      <span className="font-bold text-[#012738]">{booking.user.name}</span>
    </div>
    <div className="flex flex-col justify-between text-sm gap-1">
      <span className="text-gray-600">رقم الجوال</span>
      <span className="font-bold text-[#012738]">{booking.user.phone}</span>
    </div>
    
  </div>
</div>
        <div
          className={cn(
            "flex items-center justify-between gap-3 bg-[#FCF9F466] border p-3 lg:p-5 rounded-lg",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{ transitionDelay: "350ms" }}
        >
          <div>
            <p className="text-sm lg:text-base font-bold text-gray-800">
              حالة الدفع
            </p>
            <div
              className={`flex items-center justify-start gap-1 mt-1 ${getPaymentStatusColor(booking.payment_status)} px-2 py-1 rounded-full text-xs font-medium`}
            >
              {booking.payment_status === "paid" ? (
                <FaCheckCircle className="h-4 w-4" />
              ) : (
                <FaTimesCircle className="h-4 w-4" />
              )}
              <span className="text-sm">
                {getPaymentStatusLabel(booking.payment_status)}
              </span>
            </div>
          </div>
          {isPaymentPending && (
            <div className="flex items-end">
              <button
                onClick={() => setShowPaymentPopup(true)}
                className="w-fit flex items-center justify-center gap-2 px-4 py-2 bg-[#012738] text-white rounded-xl hover:bg-[#012738]/90 transition-all hover:scale-[1.02] text-sm"
              >
                <FaCreditCard className="h-4 w-4" />
                <span className="font-medium">إعادة الدفع</span>
              </button>
            </div>
          )}
        </div>

        {/* زر تمديد الحجز - يظهر فقط عندما تكون حالة الدفع مدفوع */}
        {!isCheckingExtension && isPaymentPaid && canExtend && (
          <div
            className={cn(
              "pt-2",
              "transform transition-all duration-500 ease-out",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
            )}
            style={{ transitionDelay: "400ms" }}
          >
            <button
              onClick={handleExtend}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl transition-all hover:scale-[1.02]"
            >
              <span className="font-medium">تمديد الحجز</span>
            </button>

            {extensionData && (
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500 text-center">
                يمكنك التمديد حتى {extensionData.max_extension_days} يوم إضافي
                {/* {extensionData.daily_price && (
                  <div className="flex items-center gap-1">
                    <span>
                      | السعر اليومي:
                      {extensionData.daily_price}
                    </span>
                    <Image
                      src="/images/SAR.png"
                      alt="ريال"
                      width={20}
                      height={20}
                      className="w-3 h-3"
                    />
                  </div>
                )} */}
              </div>
            )}
          </div>
        )}

        {/* رسالة عدم إمكانية التمديد - تظهر فقط عندما تكون حالة الدفع مدفوع */}
        {!isCheckingExtension &&
          isPaymentPaid &&
          !canExtend &&
          booking.status !== "completed" && (
            <div
              className={cn(
                "pt-2",
                "transform transition-all duration-500 ease-out",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                <p>لا يمكن تمديد هذا الحجز في الوقت الحالي</p>
              </div>
            </div>
          )}

        {/* رسالة للحجز غير المدفوع - عدم إمكانية التمديد */}
        {/* {!isCheckingExtension && isPaymentPending && (
          <div
            className={cn(
              "pt-2",
              "transform transition-all duration-500 ease-out",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
            )}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="text-center text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
              <p>⚠️ يجب دفع قيمة الحجز أولاً لتتمكن من تمديده</p>
            </div>
          </div>
        )} */}
      </div>

      {showPaymentPopup && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10 rounded-t-3xl">
              <h3 className="text-lg font-bold">اختر طريقة الدفع</h3>
              <button
                onClick={closePaymentPopup}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={isProcessingPayment}
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <PaymentMethodsList
                selectedMethod={selectedPaymentMethod}
                onSelect={setSelectedPaymentMethod}
                rentalType="يومي"
              />
            </div>

            <div className="p-4 border-t sticky bottom-0 bg-white">
              <button
                onClick={handleRepayment}
                disabled={!selectedPaymentMethod || isProcessingPayment}
                className={cn(
                  "w-full py-3 rounded-xl text-white font-bold transition-all",
                  selectedPaymentMethod && !isProcessingPayment
                    ? "bg-[#012738] hover:bg-[#012738]/90 hover:scale-[1.02]"
                    : "bg-gray-300 cursor-not-allowed",
                )}
              >
                {isProcessingPayment ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    جاري المعالجة...
                  </span>
                ) : (
                  "تأكيد الدفع"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        .animate-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
