'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { LoaderCircle, Timer, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface OTPPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<boolean>;
  isLoading: boolean;
  phoneNumber?: string;
  onResend: () => Promise<boolean>;
}

const emptyOtp = () => ['', '', '', ''];
const normalizeDigits = (value: string) => value
  .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x660))
  .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x6f0))
  .replace(/\D/g, '');

export default function OTPPopup({ isOpen, onClose, onVerify, isLoading, phoneNumber, onResend }: OTPPopupProps) {
  const [otp, setOtp] = useState(emptyOtp);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const busy = useRef(false);
  const cooldown = useRef<{ phone?: string; deadline: number } | null>(null);
  const disabled = isLoading || isVerifying || isResending;

  useEffect(() => {
    if (!isOpen) return;
    setOtp(emptyOtp());
    if (!cooldown.current || cooldown.current.phone !== phoneNumber) {
      cooldown.current = { phone: phoneNumber, deadline: Date.now() + 59000 };
    }
    const tick = () => setSecondsLeft(Math.max(0, Math.ceil(((cooldown.current?.deadline || 0) - Date.now()) / 1000)));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [isOpen, phoneNumber]);

  async function verify(code: string) {
    if (busy.current || disabled || code.length !== 4) return;
    busy.current = true;
    setIsVerifying(true);
    try {
      if (await onVerify(code)) setOtp(emptyOtp());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذر تأكيد رمز التحقق');
    } finally {
      busy.current = false;
      setIsVerifying(false);
    }
  }

  function fillDigits(index: number, value: string) {
    const digits = normalizeDigits(value).slice(0, 4);
    const next = [...otp];
    if (!digits) next[index] = '';
    else {
      const start = digits.length === 4 ? 0 : index;
      for (let offset = 0; offset < digits.length && start + offset < 4; offset++) next[start + offset] = digits[offset];
      inputRefs.current[Math.min(start + digits.length, 3)]?.focus();
    }
    setOtp(next);
    if (next.every(Boolean)) void verify(next.join(''));
  }

  async function resend() {
    if (secondsLeft > 0 || disabled || busy.current) return;
    busy.current = true;
    setIsResending(true);
    try {
      if (await onResend()) {
        cooldown.current = { phone: phoneNumber, deadline: Date.now() + 59000 };
        setSecondsLeft(59);
        setOtp(emptyOtp());
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'تعذر إعادة إرسال الرمز');
    } finally {
      busy.current = false;
      setIsResending(false);
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open && !busy.current && !isLoading) onClose(); }} disablePointerDismissal>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[80] bg-black/35" />
        <Dialog.Popup dir="rtl" initialFocus={() => inputRefs.current[0]}
          className="fixed left-1/2 top-[32%] z-[81] w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] bg-white px-7 pb-10 pt-10 shadow-xl outline-none sm:top-1/2 sm:px-10 sm:pb-11 sm:pt-11">
          <Dialog.Title className="sr-only">رمز التحقق</Dialog.Title>
          <Dialog.Description className="sr-only">أدخل الرمز المكون من أربعة أرقام المرسل إلى {phoneNumber || 'رقم جوالك'}. سيتم تأكيده تلقائياً عند اكتماله.</Dialog.Description>
          <Dialog.Close type="button" disabled={disabled} aria-label="إغلاق رمز التحقق"
            className="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 disabled:opacity-40">
            <X className="size-4" strokeWidth={1.5} />
          </Dialog.Close>
          <div className="flex justify-center gap-2.5 sm:gap-3" dir="ltr" aria-label="رمز التحقق">
            {otp.map((digit, index) => (
              <input key={index} ref={(element) => { inputRefs.current[index] = element; }}
                type="text" inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={4} value={digit} aria-label={`الرقم ${index + 1} من رمز التحقق`} disabled={disabled}
                onChange={(event) => fillDigits(index, event.target.value)}
                onPaste={(event) => { event.preventDefault(); fillDigits(index, event.clipboardData.getData('text')); }}
                onFocus={(event) => event.target.select()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') { event.preventDefault(); void verify(otp.join('')); }
                  else if (event.key === 'Backspace' && !otp[index] && index > 0) {
                    event.preventDefault();
                    const next = [...otp];
                    next[index - 1] = '';
                    setOtp(next);
                    inputRefs.current[index - 1]?.focus();
                  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    inputRefs.current[Math.max(0, Math.min(3, index + (event.key === 'ArrowLeft' ? -1 : 1)))]?.focus();
                  }
                }}
                className="h-14 w-14 min-w-0 rounded-[17px] border-[1.5px] border-[#d7d7d7] bg-[#fcfaf6] text-center text-2xl font-bold text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-60 sm:h-16 sm:w-16 sm:rounded-[19px]"
              />
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2 text-[#606060]" dir="ltr" role="timer" aria-label={`إعادة الإرسال متاحة بعد ${secondsLeft} ثانية`}>
            <span className="text-sm font-bold tabular-nums sm:text-base">{`${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`}</span>
            <Timer className="size-5 text-[#c8cdd0]" fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-1.5 text-sm text-[#747474] sm:text-base">
            <span>لم تستلم الرمز؟</span>
            <button type="button" onClick={() => void resend()} disabled={secondsLeft > 0 || disabled}
              className="font-bold text-primary enabled:hover:underline disabled:cursor-default disabled:text-[#a3a3a3]">إعادة إرسال</button>
          </div>
          <div role="status" className="sr-only">{isVerifying ? 'جاري التحقق من الرمز' : isResending ? 'جاري إعادة إرسال الرمز' : ''}</div>
          {(isVerifying || isResending) && <LoaderCircle className="absolute bottom-3 left-1/2 size-4 -translate-x-1/2 animate-spin text-primary" aria-hidden="true" />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
