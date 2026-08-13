'use client';
import { useState } from 'react';
import { FaClock, FaEnvelope, FaHeadset, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
// import { FaHeadset, FaWhatsapp, FaEnvelope, FaPhone, FaClock, FaMessage } from 'react-icons/fa';
import { toast } from 'sonner';

export default function SupportPage() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('⚠️ يرجى كتابة رسالتك');
      return;
    }
    toast.success('✅ تم إرسال رسالتك، سيتم الرد عليك خلال 24 ساعة');
    setMessage('');
  };

  return (
    <div className="min-h-screen mt-12 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeadset className="text-4xl text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            الدعم الفني
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            فريق الدعم الفني جاهز لمساعدتك على مدار الساعة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* بطاقات التواصل */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/10 p-3 rounded-full">
                  <FaWhatsapp className="text-3xl text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">واتساب</p>
                  <p className="font-bold text-gray-800" dir="ltr">+966 50 000 0000</p>
                  <a href="#" className="text-green-500 text-sm font-bold hover:underline">
                    تواصل الآن
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FaPhone className="text-3xl text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">اتصال مباشر</p>
                  <p className="font-bold text-gray-800" dir="ltr">+966 50 000 0000</p>
                  <p className="text-xs text-gray-400">متاح 24/7</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-full">
                  <FaEnvelope className="text-3xl text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                  <p className="font-bold text-gray-800" dir="ltr">support@carrent.com</p>
                  <p className="text-xs text-gray-400">نرد خلال 24 ساعة</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500/10 p-3 rounded-full">
                  <FaClock className="text-3xl text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">أوقات العمل</p>
                  <p className="font-bold text-gray-800">🕐 24/7</p>
                  <p className="text-xs text-gray-400">طوال أيام الأسبوع</p>
                </div>
              </div>
            </div>
          </div>

          {/* نموذج إرسال رسالة */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              أرسل رسالة
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              سنقوم بالرد عليك في أقرب وقت ممكن
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  رسالتك
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
                  placeholder="اكتب مشكلتك أو استفسارك هنا..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FaMessage />
                إرسال الرسالة
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}