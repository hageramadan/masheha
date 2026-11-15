'use client';

import BirthDatePicker from './BirthDatePicker';

export interface RegistrationFieldsValue {
  email: string;
  date_of_birth: string;
  license_number: string;
}

export const emptyRegistrationFields: RegistrationFieldsValue = { email: '', date_of_birth: '', license_number: '' };

export function validateRegistrationFields(value: RegistrationFieldsValue): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) return 'يرجى إدخال بريد إلكتروني صحيح';
  const today = new Date();
  const birthDate = new Date(`${value.date_of_birth}T00:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.date_of_birth) || Number.isNaN(birthDate.getTime()) || birthDate > today) return 'يرجى إدخال تاريخ ميلاد صحيح';
  if (!value.license_number.trim()) return 'يرجى إدخال رقم رخصة القيادة';
  return null;
}

export default function RegistrationFields({ value, onChange, disabled = false }: {
  value: RegistrationFieldsValue;
  onChange: (value: RegistrationFieldsValue) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-4">
      {([
        ['email', 'البريد الإلكتروني', 'email'],
        ['date_of_birth', 'تاريخ الميلاد', 'date'],
        ['license_number', 'رقم رخصة القيادة', 'text'],
      ] as const).map(([key, label, type]) => key === 'date_of_birth' ? (
        <BirthDatePicker key={key} value={value.date_of_birth} onChange={(date_of_birth) => onChange({ ...value, date_of_birth })} disabled={disabled} />
      ) : (
        <label key={key} className="block text-sm font-bold text-gray-700">
          {label} *
          <input
            type={type}
            value={value[key]}
            onChange={(event) => onChange({ ...value, [key]: event.target.value })}
            disabled={disabled}
            className="mt-2 w-full px-4 py-3 border-2 rounded-xl border-gray-200 focus:outline-none focus:border-primary disabled:opacity-60"
          />
        </label>
      ))}
    </div>
  );
}
