import Link from 'next/link';
import { FaShieldAlt, FaLock, FaEye, FaUserSecret } from 'react-icons/fa';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen mt-12 py-12 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          
          <h1 className="text-xl lg:text-3xl font-bold text-gray-800 mb-4">
            سياسة الخصوصية
          </h1>
        
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* مقدمة */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaLock className="text-primary" />
              مقدمة
            </h2>
            <p className="text-gray-600 leading-relaxed">
              نحن في مشيها لتأجير السيارات (نحن أو الشركة) نلتزم بحماية خصوصيتك. تشرح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام موقعنا الإلكتروني وخدماتنا.
            </p>
          </section>

          {/* المعلومات التي نجمعها */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaEye className="text-primary" />
              المعلومات التي نجمعها
            </h2>
            <p className="text-gray-600 font-semibold mt-2">2.1 المعلومات التي تقدمها لنا</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4">
              <li>الاسم الكامل</li>
              <li>رقم الهاتف</li>
              <li>البريد الإلكتروني</li>
              <li>معلومات الرخصة</li>
              <li>معلومات الدفع</li>
              <li>معلومات الحجز (التواريخ، الموقع، نوع السيارة)</li>
            </ul>
            <p className="text-gray-600 font-semibold mt-4">2.2 المعلومات التي نجمعها تلقائياً</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4">
              <li>عنوان IP</li>
              <li>نوع المتصفح ونظام التشغيل</li>
              <li>معلومات الجهاز</li>
              <li>بيانات الاستخدام والتفاعل مع الموقع</li>
            </ul>
          </section>

          {/* كيفية استخدام المعلومات */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaUserSecret className="text-primary" />
              كيفية استخدام المعلومات
            </h2>
            <p className="text-gray-600 leading-relaxed">
              نستخدم المعلومات التي نجمعها للأغراض التالية:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4 mt-2">
              <li>معالجة وإدارة الحجوزات</li>
              <li>التواصل معك بخصوص حجوزاتك</li>
              <li>تحسين خدماتنا وتجربة المستخدم</li>
              <li>إرسال التحديثات والعروض الترويجية (بموافقتك)</li>
              <li>الامتثال للالتزامات القانونية</li>
              <li>منع الاحتيال وحماية أمن الموقع</li>
            </ul>
          </section>

          {/* مشاركة المعلومات */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">مشاركة المعلومات</h2>
            <p className="text-gray-600 leading-relaxed">
              نحن لا نبيع معلوماتك الشخصية. قد نشارك معلوماتك مع:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4 mt-2">
              <li><span className="font-semibold">مزودي الخدمات:</span> الشركات التي تساعدنا في تشغيل موقعنا (مثل معالجة المدفوعات، الاستضافة)</li>
              <li><span className="font-semibold">شركات التأجير:</span> شركات تأجير السيارات التي نتعامل معها لتنفيذ الحجوزات</li>
              <li><span className="font-semibold">السلطات القانونية:</span> عند الحاجة للامتثال للقوانين أو حماية حقوقنا</li>
            </ul>
          </section>

          {/* حماية المعلومات */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">حماية المعلومات</h2>
            <p className="text-gray-600 leading-relaxed">
              نتخذ تدابير أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير. نستخدم تقنيات التشفير والجدران النارية وأنظمة الحماية المتقدمة.
            </p>
          </section>

          {/* ملفات تعريف الارتباط */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">ملفات تعريف الارتباط (Cookies)</h2>
            <p className="text-gray-600 leading-relaxed">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.
            </p>
          </section>

          {/* حقوقك */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">حقوقك</h2>
            <p className="text-gray-600 leading-relaxed">
              لديك الحق في:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 pr-4 mt-2">
              <li>الوصول إلى معلوماتك الشخصية</li>
              <li>تصحيح المعلومات غير الدقيقة</li>
              <li>طلب حذف معلوماتك</li>
              <li>الاعتراض على معالجة معلوماتك</li>
              <li>طلب نقل معلوماتك</li>
            </ul>
          </section>

          {/* الاحتفاظ بالبيانات */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">الاحتفاظ بالبيانات</h2>
            <p className="text-gray-600 leading-relaxed">
              نحتفظ بمعلوماتك الشخصية طالما كانت ضرورية لتقديم خدماتنا والامتثال للالتزامات القانونية. بعد انتهاء هذه الفترة، سنقوم بحذف أو إخفاء هوية معلوماتك بشكل آمن.
            </p>
          </section>

          {/* التغييرات على سياسة الخصوصية */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">التغييرات على سياسة الخصوصية</h2>
            <p className="text-gray-600 leading-relaxed">
              قد نحدث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بأي تغييرات جوهرية من خلال نشر السياسة المحدثة على موقعنا مع تحديث تاريخ آخر تحديث
            </p>
          </section>

          {/* الاتصال بنا */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">الاتصال بنا</h2>
            <p className="text-gray-600 leading-relaxed">
              إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه أو ممارساتنا، يرجى الاتصال بنا:
            </p>
            <ul className="list-none text-gray-600 space-y-1 mt-2">
              <li><span className="font-semibold">البريد الإلكتروني:</span> privacy@mashiha.com</li>
              {/* <li><span className="font-semibold">الهاتف:</span> +966 50 123 4567</li> */}
              <li><span className="font-semibold">العنوان:</span> المملكة العربية السعودية</li>
            </ul>
          </section>

          <div className="border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} مشيها لتأجير السيارات. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </div>
  );
}