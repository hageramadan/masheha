'use client';
import Link from 'next/link';
import AuthRegister from '@/src/components/auth/AuthRegister';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="block mb-6 text-gray-600">العودة للرئيسية</Link>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <AuthRegister onSwitchToLogin={() => { window.location.href = '/login'; }} onSuccess={() => { window.location.href = '/'; }} />
        </div>
      </div>
    </div>
  );
}
