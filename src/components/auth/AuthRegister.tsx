'use client';
import PhoneAuthForm from './PhoneAuthForm';

export default function AuthRegister({ onSwitchToLogin, onSuccess }: { onSwitchToLogin: () => void; onSuccess?: () => void }) {
  return <PhoneAuthForm mode="register" onSwitch={onSwitchToLogin} onSuccess={onSuccess} />;
}
