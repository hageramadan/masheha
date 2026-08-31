// src/components/common/Footer.tsx
"use client";

import { FaEnvelope, FaPhone } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SettingsData {
  phone: string;
  email: string;
  name: string;
  light_logo: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `https://admin.masheha.com/api/settings`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept-Language": "ar",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.result && data.data) {
          setSettings(data.data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        // استخدام بيانات افتراضية في حالة الفشل
        setSettings({
          phone: "0566666364",
          email: "Masheha.sa@gmail.com",
          name: "مشيها",
          light_logo: "/logo.png",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // عرض حالة التحميل (نفس التصميم الحالي)
  if (loading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <div className="w-36 lg:w-52 h-12 bg-gray-700 animate-pulse rounded"></div>
            </div>
            <div>
              <div className="h-6 w-24 bg-gray-700 animate-pulse rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-700 animate-pulse rounded"></div>
                <div className="h-4 w-16 bg-gray-700 animate-pulse rounded"></div>
                <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
              </div>
            </div>
            <div>
              <div className="h-6 w-24 bg-gray-700 animate-pulse rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-28 bg-gray-700 animate-pulse rounded"></div>
                <div className="h-4 w-32 bg-gray-700 animate-pulse rounded"></div>
              </div>
            </div>
            <div>
              <div className="h-6 w-24 bg-gray-700 animate-pulse rounded mb-4"></div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-700 animate-pulse rounded-full"></div>
                <div className="w-10 h-10 bg-gray-700 animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-4 text-center text-gray-400">
            © جميع الحقوق محفوظة | مشيها 2025
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* الشعار - بدون تغيير */}
          <div className="col-span-2 lg:col-span-1">
            <Image
              src={"/logo.png"}
              alt={settings?.name || "CarRent Logo"}
              width={250}
              height={50}
              className="w-36 lg:w-52"
              unoptimized
            />
          </div>

          {/* روابط أساسية - بدون تغيير */}
          <div>
            <h4 className="font-bold mb-4 text-lg">روابط أساسية</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-white">
                  السيارات
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-white">
                  انضم الينا
                </Link>
              </li>
            </ul>
          </div>

          {/* المساعدة - بدون تغيير */}
          <div>
            <h4 className="font-bold mb-4 text-lg">المساعدة</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* تواصل معنا - مع إضافة رقم الهاتف والإيميل ديناميكياً */}
          <div>
            <h4 className="font-bold mb-4 text-lg">تواصل معنا</h4>
            <div className="flex items-center gap-4">
              {/* رقم الهاتف */}
              <a
                href={`tel:${settings?.phone || "0566666364"}`}
                className="flex items-center gap-3 p-2 bg-[#5CE1E6] rounded-full hover:scale-105 transition-transform"
                title={settings?.phone || "0566666364"}
              >
                <FaPhone className="text-white text-lg w-5 h-5" />
              </a>

              {/* البريد الإلكتروني */}
              <a
                href={`mailto:${settings?.email || "Masheha.sa@gmail.com"}`}
                className="flex items-center gap-3 p-2 bg-[#5CE1E6] rounded-full hover:scale-105 transition-transform"
                title={settings?.email || "Masheha.sa@gmail.com"}
              >
                <FaEnvelope className="text-white text-lg w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-4 text-center text-gray-400">
          © جميع الحقوق محفوظة | {settings?.name || "مشيها"} 2025
        </div>
      </div>
    </footer>
  );
}