'use client';
import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // محاكاة إرسال البيانات
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen  py-12 px-4 mt-12">
      <div className="container mx-auto max-w-6xl">
        {/* العنوان */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            تواصل معنا
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            نسعد بتواصلك معنا، فريقنا جاهز للرد على استفساراتك على مدار الساعة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* معلومات الاتصال */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-base lg:text-lg font-bold text-gray-800 mb-6">معلومات الاتصال</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FaPhone className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الهاتف</p>
                    <p className="font-bold text-gray-800" dir="ltr">+966 50 000 0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FaEnvelope className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-bold text-gray-800" dir="ltr">info@carrent.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FaMapMarkerAlt className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">العنوان</p>
                    <p className="font-bold text-gray-800">الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FaClock className="text-primary text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">أوقات العمل</p>
                    <p className="font-bold text-gray-800">🕐 24/7 - طوال الأسبوع</p>
                  </div>
                </div>
              </div>
            </div>

            {/* وسائل التواصل الاجتماعي */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-base lg:text-lg font-bold text-primary mb-4 mb-4">تابعنا</h2>
              <div className="flex gap-4 text-3xl">
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                  <FaWhatsapp />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FaFacebook />
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                  <FaInstagram />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>

          {/* نموذج التواصل */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">أرسل رسالة</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الاسم
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                      placeholder="الاسم الكامل"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                    placeholder="+966 50 000 0000"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الموضوع
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">اختر الموضوع</option>
                    <option value="استفسار عام">استفسار عام</option>
                    <option value="حجز سيارة">حجز سيارة</option>
                    <option value="شكوى">شكوى</option>
                    <option value="اقتراح">اقتراح</option>
                    <option value="دعم فني">دعم فني</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الرسالة
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      جاري الإرسال...
                    </span>
                  ) : (
                    'إرسال الرسالة'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* الخريطة */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">📍 خريطة الموقع</p>
          </div>
        </div>
      </div>
    </div>
  );
}