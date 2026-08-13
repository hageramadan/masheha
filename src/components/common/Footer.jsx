import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaCar,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* القسم الأول */}
          <div>
            <Image src="/logo.png" alt="CarRent Logo" width={250} height={50} />
          </div>

          {/* القسم الثاني */}
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
                <Link href="/contact" className="hover:text-white">
                  انضم الينا
                </Link>
              </li>
            </ul>
          </div>

          {/* القسم الثالث */}
          <div>
            <h4 className="font-bold mb-4 text-lg">المساعدة</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/support" className="hover:text-white">
                  الدعم الفني
                </Link>
              </li>
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

          {/* القسم الرابع - وسائل التواصل */}
          <div>
            <h4 className="font-bold mb-4 text-lg">تواصل معنا</h4>
            <div className="flex items-center gap-4">
              {/* الهاتف */}
              <div className="flex items-center gap-3 p-2 bg-[#5CE1E6] rounded-full">
                <FaPhone className="text-white text-lg w-5 h-5" />
                {/* <span dir="ltr">+966 50 000 0000</span> */}
              </div>

              {/* الإيميل */}
              <div className="flex items-center gap-3 p-2 bg-[#5CE1E6] rounded-full ">
                <FaEnvelope className="text-white text-lg w-5 h-5" />
                {/* <span dir="ltr">info@carrent.com</span> */}
              </div>

              {/* الموقع */}
              <div className="flex items-center gap-3 p-2 bg-[#5CE1E6] rounded-full">
                <FaMapMarkerAlt className="text-white text-lg w-5 h-5" />
                {/* <span>الرياض، المملكة العربية السعودية</span> */}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-4 text-center text-gray-400">
          © جميع الحقوق محفوظة | ********** 2025
        </div>
      </div>
    </footer>
  );
}
