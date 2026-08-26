/* eslint-disable @typescript-eslint/no-explicit-any */

// src/components/profile/ProfileInfo.tsx
"use client";

import { useState, useEffect } from "react";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaTimes,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { cn } from "@/src/lib/utils";
import PhoneInput from "../contact/PhoneInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function ProfileInfo() {
  const router = useRouter();
  const { user, getUserProfile, updateProfile, logout } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+966");
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // جلب بيانات المستخدم عند تحميل المكون
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        await getUserProfile();
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("حدث خطأ في جلب بيانات المستخدم");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // تحديث الحقول عند تغيير بيانات المستخدم
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setPhoneNumber(user.phone || "");
      setCountryCode(user.country_code || "+966");
    }
  }, [user]);

  // أنيميشن عند تحميل المكون
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error(" يرجى إدخال الاسم");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 8) {
      toast.error(" يرجى إدخال رقم هاتف صحيح");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: fullName.trim(),
        phone: phoneNumber,
        country_code: countryCode,
      });
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = async () => {
    setShowLogoutPopup(false);
    await logout();
    router.push("/");
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  const handlePhoneChange = (phone: string, code: string) => {
    setPhoneNumber(phone);
    setCountryCode(code);
  };

 
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <FaSpinner className="w-8 h-8 text-primary animate-spin" />
           
          </div>
        </div>
      </div>
    );
  }

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
              disabled={!isEditing}
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

        
        <div
          className={cn(
            "flex  items-center justify-between gap-4 pt-2",
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

          {/* أزرار التعديل والحفظ */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // إعادة تعيين القيم للقيم الأصلية
                    if (user) {
                      setFullName(user.name || "");
                      setPhoneNumber(user.phone || "");
                      setCountryCode(user.country_code || "+966");
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg bg-primary transition-all hover:bg-primary/90 hover:scale-[1.02]",
                    isSaving && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ"
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                تعديل
              </button>
            )}
          </div>
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
                <span className="text-sm">نعم</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}