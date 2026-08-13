'use client';
import Link from 'next/link';
import { FaHome, FaSearch } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="text-center max-w-md">
        {/* رقم 404 */}
        <div className="text-9xl font-bold text-primary/10 mb-4">404</div>
        
        {/* الأيقونة */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaSearch className="text-4xl text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          الصفحة غير موجودة
        </h1>
        <p className="text-gray-500 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <FaHome />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}