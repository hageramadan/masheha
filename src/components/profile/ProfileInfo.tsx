// src/components/profile/ProfileInfo.tsx
"use client";

import { useState, useEffect } from "react";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { cn } from "@/src/lib/utils";
import PhoneInput from "../contact/PhoneInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfileInfo() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // أنيميشن عند تحميل المكون
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    // هنا يمكن إضافة منطق حفظ البيانات
    console.log("تم حفظ البيانات", { fullName, phoneNumber, countryCode });
    
    // إظهار توستر نجاح
    toast.success("تم حفظ البيانات بنجاح", {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#10B981",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "16px",
      },
      icon: "✅",
    });
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    // هنا يمكن إضافة منطق تسجيل الخروج
    console.log("تم تسجيل الخروج");
    
    // إظهار توستر نجاح تسجيل الخروج
    toast.success("تم تسجيل الخروج بنجاح", {
      duration: 2000,
      position: "top-center",
    
    });
    
    // تأخير بسيط ثم الانتقال إلى الصفحة الرئيسية
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const handlePhoneChange = (phone: string, code: string) => {
    setPhoneNumber(phone);
    setCountryCode(code);
  };

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-2xl border p-6 space-y-6",
          "transform transition-all duration-500 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        {/* الاسم */}
        <div
          className={cn(
            "space-y-2",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          <label className="block text-sm lg:text-base text-gray-700">
            الاسم
          </label>
          <div className="relative">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={cn(
                "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                isEditing
                  ? "border-primary/50 bg-white"
                  : "border-gray-200 bg-gray-50 text-gray-600"
              )}
              placeholder="الاسم"
            />
          </div>
        </div>

        {/* رقم الهاتف */}
        <div
          className={cn(
            "space-y-2",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          <label className="block text-sm lg:text-base text-gray-700">
            رقم الهاتف
          </label>
          <div className="flex items-center gap-2">
            <PhoneInput
              value={phoneNumber}
              onChange={handlePhoneChange}
              required={true}
            />
          </div>
        </div>

        {/* تسجيل الخروج */}
        <div
          className={cn(
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "200ms" }}
        >
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm lg:text-base font-bold text-red-500 transition-colors py-2 hover:text-red-600"
          >
            <FaSignOutAlt className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>

        {/* زر حفظ */}
        <div
          className={cn(
            "flex items-center justify-end pt-2",
            "transform transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "250ms" }}
        >
          <button
            type="button"
            onClick={handleSave}
            className={cn(
              "w-full lg:w-2xs px-4 py-3 text-sm font-medium text-white rounded-lg bg-primary transition-all hover:bg-primary/90 hover:scale-[1.02]"
            )}
          >
            <span className="text-bold text-base lg:text-lg">حفظ</span>
          </button>
        </div>
      </div>

      {/* Popup تأكيد تسجيل الخروج */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-300">
            {/* أيقونة */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <FaSignOutAlt className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* العنوان */}
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              تسجيل الخروج
            </h2>

            {/* الرسالة */}
            <p className="text-center text-gray-500 mb-6">
              هل أنت متأكد من رغبتك في تسجيل الخروج؟
            </p>

            {/* الأزرار */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="h-4 w-4" />
                <span>إلغاء</span>
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all hover:scale-[1.02]"
              >
                <FaCheck className="h-4 w-4" />
                <span>نعم، تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}