import Link from 'next/link';
import { FaFileContract, FaGavel, FaCheckCircle, FaUserCheck } from 'react-icons/fa';

export default function TermsPage() {
  return (
    <div className="min-h-screen mt-12 py-12 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-12">
        
          <h1 className="text-xl lg:text-3xl  font-bold text-gray-800 mb-4">
            الشروط والأحكام
          </h1>
         
          <p className="text-gray-500 text-sm mt-2">
            يرجى قراءة الشروط والأحكام التالية بعناية قبل استخدام خدماتنا
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* قبول الشروط */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaGavel className="text-primary" />
              قبول الشروط
            </h2>
            <p className="text-gray-600 leading-relaxed">
              باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا.
            </p>
          </section>

          {/* متطلبات التأجير */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaUserCheck className="text-primary" />
              يشترط للتأجير
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 pr-4">
              <li>وجود رخصة سارية المفعول.</li>
              <li>وجود بطاقة هوية سارية.</li>
              <li>قد يتطلب التأجير وجود بطاقة ائتمانية ومبلغ تأمين مسترجع.</li>
              <li>عدم وجود أي مطالبات مالية أو متعثرات لدى شركات التأجير.</li>
              <li>يحق لنا الامتناع عن التأجير في حال عدم الملائمة المالية للعميل.</li>
              <li>سداد المبلغ لا يعني بالضرورة الموافقة على تأجير العميل، ويجوز رفض التأجير ورد المبلغ المدفوع في حال عدم انطباق شروط التأجير على العميل.</li>
              <li>العمر يجب أن يكون أكثر من 25 سنة ميلادية.</li>
              <li>عدم وجود مطالبات مالية على المستأجر أو مخالفات مرورية.</li>
              <li>وجود حساب فعال في أبشر وتوفر نفس رقم الجوال لدى المستأجر لحظة استلامه للسيارة.</li>
            </ul>
          </section>

          {/* سياسة الإلغاء والتعديل */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaCheckCircle className="text-primary" />
              سياسة الإلغاء والتعديل
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 pr-4">
              <li>في حال الإلغاء من قبل العميل خلال نفس يوم الحجز، وبعد توصيل السيارة، سيتم خصم قيمة تأجير يوم كامل مع رسوم التوصيل ويتم استرجاع المتبقي.</li>
              <li>في حال عدم اكتمال عملية التأجير لسبب عائد للمستأجر سيتم خصم قيمة يوم كامل مع رسوم التوصيل ويتم استرجاع المتبقي.</li>
              <li>في حال عدم توفر نفس الفئة المطلوبة - سيتم توفير بديل من نفس الفئة - وفي حال عدم توفره سيتم توفير فئة أعلى.</li>
              <li>قد يختلف اللون عن الصورة المعروضة وسيتم توصيل السيارة حسب الألوان المتاحة.</li>
            </ul>
          </section>

          {/* تأمين */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">سياسة التأمين</h2>
            <p className="text-gray-600 leading-relaxed">
              جميع السيارات مؤمنة تأمين شامل ضد الحوادث. يغطي التأمين الأضرار التي تلحق بالسيارة، ولكن لا يغطي الإطارات أو الزجاج أو الأضرار الناتجة عن الإهمال.
            </p>
          </section>

          {/* مسؤولية المستخدم */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">مسؤولية المستخدم</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 pr-4">
              <li>المحافظة على السيارة واستخدامها بشكل صحيح.</li>
              <li>إعادة السيارة في الوقت المحدد.</li>
              <li>تحمل تكاليف المخالفات المرورية.</li>
              <li>إبلاغ الشركة فوراً في حالة حدوث أي حادث.</li>
            </ul>
          </section>

          {/* تعديل الشروط */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">تعديل الشروط</h2>
            <p className="text-gray-600 leading-relaxed">
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو الموقع الإلكتروني.
            </p>
          </section>

          {/* تواصل معنا */}
          <section>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3">تواصل معنا</h2>
            <p className="text-gray-600 leading-relaxed">
              للاستفسارات حول هذه الشروط والأحكام، يرجى التواصل معنا عبر البريد الإلكتروني:
              <span className="text-primary font-bold" dir="ltr"> legal@mashiha.com</span>
            </p>
          </section>

          <div className="border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} مشيها لتأجير السيارات. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </div>
  );
}