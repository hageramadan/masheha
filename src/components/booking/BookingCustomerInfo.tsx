'use client';

import PhoneInput from '../contact/PhoneInput';
import RegistrationFields from '../auth/RegistrationFields';
import OTPPopup from './OTPPopup';
import { cn } from '@/src/lib/utils';
import type { useBookingIdentity } from '@/src/hooks/useBookingIdentity';
import type { BookingFormController } from '@/src/types/bookingForm';

type BookingCustomerInfoProps = Pick<BookingFormController, 'bookingData' | 'errors' | 'updateField'> & {
  identity: ReturnType<typeof useBookingIdentity>;
};

export default function BookingCustomerInfo({
  bookingData,
  errors,
  updateField,
  identity,
}: BookingCustomerInfoProps) {
  const {
    isAuthenticated,
    registrationFields,
    setRegistrationFields,
    phoneNumber,
    countryCode,
    phoneInputKey,
    isIdentityVerified,
    isVerifying,
    isOTPLoading,
    isOTPPopupOpen,
    otpPhone,
    handlePhoneChange,
    handleVerifyIdentity,
    handleVerifyOTPFromPopup,
    handleResendOTP,
    closeOtpPopup,
  } = identity;
  return <>
    <div className="bg-[#FCF9F466] border rounded-lg p-3 lg:p-5 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-bold text-[#1F2937] mb-2">
            الاسم *
          </label>

          <input
            type="text"
            value={bookingData.customerName}
            onChange={(e) =>
              updateField("customerName", e.target.value)
            }
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${errors.customerName
                ? "border-red-500"
                : "border-gray-200 focus:border-primary"
              }`}
            placeholder="الاسم"
          />

          {errors.customerName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.customerName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1F2937] mb-2">
            رقم الجوال *
          </label>

          <fieldset disabled={isAuthenticated || isVerifying || isOTPLoading}>
            <PhoneInput
              key={phoneInputKey}
              value={phoneNumber}
              onChange={handlePhoneChange}
              countryCode={countryCode}
              required={true}
            />
          </fieldset>

          {errors.customerPhone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.customerPhone}
            </p>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <RegistrationFields value={registrationFields} onChange={setRegistrationFields} disabled={isVerifying || isOTPLoading || !!otpPhone} />
      )}

      <button
        type="button"
        onClick={handleVerifyIdentity}
        disabled={isOTPLoading || isVerifying || isIdentityVerified}
        className={cn(
          "w-full py-3 rounded-xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-2",
          isIdentityVerified
            ? "bg-primary text-white cursor-default"
            : "bg-primary hover:bg-primary-dark text-white hover:scale-[1.02] hover:shadow-lg",
          (isOTPLoading || isVerifying) &&
          "opacity-50 cursor-not-allowed",
        )}
      >
        {isOTPLoading || isVerifying ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            جاري التحقق ...
          </>
        ) : isIdentityVerified ? (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
            تم التحقق
          </>
        ) : (
          "تحقق"
        )}
      </button>
    </div>

    <OTPPopup
      isOpen={isOTPPopupOpen}
      onClose={closeOtpPopup}
      onVerify={handleVerifyOTPFromPopup}
      isLoading={isOTPLoading}
      phoneNumber={otpPhone ? `${otpPhone.country_code}${otpPhone.phone.replace(/^0/, "")}` : ""}
      onResend={handleResendOTP}
    />

  </>;
}
