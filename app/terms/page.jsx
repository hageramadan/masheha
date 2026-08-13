import Link from 'next/link';
import { FaFileContract, FaGavel, FaCheckCircle, FaUserCheck } from 'react-icons/fa';

export default function TermsPage() {
  return (
    <div className="min-h-screen mt-12 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaFileContract className="text-4xl text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            الشروط والأحكام
          </h1>
          <p className="text-gray-600">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaGavel className="text-primary" />
              قبول الشروط
            </h2>
            <p className="text-gray-600 leading-relaxed">
              باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaUserCheck className="text-primary" />
              متطلبات التأجير
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 pr-4">
              <li>أن يكون العمر 21 سنة فأكثر</li>
              <li>رخصة قيادة سارية المفعول</li>
              <li>بطاقة هوية سارية</li>
              <li>بطاقة ائتمان سارية للدفع</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaCheckCircle className="text-primary" />
              سياسة الحجز والإلغاء
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 pr-4">
              <li>يمكن إلغاء الحجز مجاناً قبل 24 ساعة من موعد الاستلام</li>
              <li>في حالة الإلغاء خلال 24 ساعة، يتم خصم 25% من قيمة الحجز</li>
              <li>في حالة عدم الحضور، يتم خصم 100% من قيمة الحجز</li>
              <li>يمكن تعديل موعد الاستلام والإرجاع بشرط التوفر</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">سياسة التأمين</h2>
            <p className="text-gray-600 leading-relaxed">
              جميع السيارات مؤمنة تأمين شامل ضد الحوادث. يغطي التأمين الأضرار التي تلحق بالسيارة، ولكن لا يغطي الإطارات أو الزجاج أو الأضرار الناتجة عن الإهمال.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">مسؤولية المستخدم</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 pr-4">
              <li>المحافظة على السيارة واستخدامها بشكل صحيح</li>
              <li>إعادة السيارة في الوقت المحدد</li>
              <li>تحمل تكاليف المخالفات المرورية</li>
              <li>إبلاغ الشركة فوراً في حالة حدوث أي حادث</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">تعديل الشروط</h2>
            <p className="text-gray-600 leading-relaxed">
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو الموقع الإلكتروني.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">تواصل معنا</h2>
            <p className="text-gray-600 leading-relaxed">
              للاستفسارات حول هذه الشروط والأحكام، يرجى التواصل معنا عبر البريد الإلكتروني:
              <span className="text-primary font-bold" dir="ltr"> legal@carrent.com</span>
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