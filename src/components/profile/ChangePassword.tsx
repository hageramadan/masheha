// src/components/profile/ChangePassword.tsx
'use client';

import { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaArrowRight } from 'react-icons/fa';
import { cn } from '@/src/lib/utils';

interface ChangePasswordProps {
  onClose: () => void;
}

export default function ChangePassword({ onClose }: ChangePasswordProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      oldPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!oldPassword) {
      newErrors.oldPassword = 'كلمة المرور القديمة مطلوبة';
    }

    if (!newPassword) {
      newErrors.newPassword = 'كلمة المرور الجديدة مطلوبة';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // محاكاة طلب API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('تم تغيير كلمة المرور بنجاح');
      // هنا يمكنك إضافة منطق حفظ كلمة المرور
      onClose(); // إغلاق المودال بعد النجاح
    } catch (error) {
      console.error('حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-6">
      {/* عنوان المودال */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            إنشاء كلمة مرور جديدة
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            تعيين كلمة المرور الخاصة بك
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* كلمة المرور القديمة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            كلمة المرور القديمة
          </label>
          <div className="relative">
            <input
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="كلمة المرور القديمة"
              className={cn(
                "w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors pr-12",
                errors.oldPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-primary"
              )}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showOldPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
          )}
        </div>

        {/* كلمة المرور الجديدة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            إنشاء كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="إنشاء كلمة المرور"
              className={cn(
                "w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors pr-12",
                errors.newPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-primary"
              )}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* تأكيد كلمة المرور */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="تأكيد كلمة المرور"
              className={cn(
                "w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors pr-12",
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-primary"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* نسيت كلمة المرور */}
        <div className="text-left">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        {/* زر الحفظ */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              جاري الحفظ...
            </span>
          ) : (
            <>
              حفظ
              <FaArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}