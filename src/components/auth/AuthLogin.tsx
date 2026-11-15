'use client';
import PhoneAuthForm from './PhoneAuthForm';

export default function AuthLogin({ onSwitchToRegister, onSuccess }: { onSwitchToRegister: () => void; onSuccess?: () => void }) {
  return <PhoneAuthForm mode="login" onSwitch={onSwitchToRegister} onSuccess={onSuccess} />;
}
