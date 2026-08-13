import Link from 'next/link';
import { FaShieldAlt, FaLock, FaEye, FaUserSecret } from 'react-icons/fa';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen mt-12 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-4xl text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-gray-600">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaLock className="text-primary" />
              مقدمة
            </h2>
            <p className="text-gray-600 leading-relaxed">
              نحن في شركة تأجير السيارات نلتزم بحماية خصوصية زوارنا وعملائنا. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام خدماتنا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaEye className="text-primary" />
              المعلومات التي نجمعها
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 pr-4">
              <li>الاسم الكامل</li>
              <li>رقم الهاتف</li>
              <li>البريد الإلكتروني</li>
              <li>رقم الهوية الوطنية</li>
              <li>معلومات الحجز والدفع</li>
              <li>بيانات الموقع (اختياري)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaUserSecret className="text-primary" />
              كيفية استخدام المعلومات
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 pr-4">
              <li>معالجة طلبات الحجز</li>
              <li>تحسين خدماتنا</li>
              <li>إرسال عروض وخصومات حصرية</li>
              <li>خدمة العملاء والدعم الفني</li>
              <li>الامتثال للمتطلبات القانونية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">الأمان</h2>
            <p className="text-gray-600 leading-relaxed">
              نستخدم أحدث تقنيات التشفير لحماية بياناتك. جميع المعلومات تُخزن في خوادم آمنة ولا نشاركها مع أطراف ثالثة إلا بموافقتك أو عند الضرورة القانونية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">حذف البيانات</h2>
            <p className="text-gray-600 leading-relaxed">
              يمكنك طلب حذف حسابك وبياناتك في أي وقت عن طريق التواصل مع فريق الدعم. سنقوم بحذف بياناتك خلال 30 يوم من تاريخ الطلب.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">تواصل معنا</h2>
            <p className="text-gray-600 leading-relaxed">
              إذا كان لديك أي استفسار حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني:
              <span className="text-primary font-bold" dir="ltr"> privacy@carrent.com</span>
            </p>
          </section>

          <div className="border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} تأجير السيارات. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </div>
  );
}