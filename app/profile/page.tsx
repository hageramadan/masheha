// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/ui/tabs';
import ProfileInfo from '@/src/components/profile/ProfileInfo';
import BookingsList from '@/src/components/profile/BookingsList';
import { cn } from '@/src/lib/utils';
import { UpdatePaymentStatusService } from '@/src/services/updatePaymentStatusService';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      // ✅ استخدام URLSearchParams من window.location
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment_status');
      const bookingId = params.get('booking_id');
      const uuid = params.get('uuid');
      const paymentMethodId = params.get('payment_method_id');

      if (paymentStatus && bookingId) {
        setIsProcessingCallback(true);

        try {
          const token = localStorage.getItem('token');
          
          if (paymentStatus === 'success' || paymentStatus === 'paid') {
            if (uuid && paymentMethodId) {
              await UpdatePaymentStatusService.updatePaymentSuccess(
                uuid,
                parseInt(paymentMethodId),
                { 
                  return_data: Object.fromEntries(params.entries()),
                  status: paymentStatus 
                },
                token || undefined
              );
            }
            
            toast.success('✅ تم الدفع بنجاح!');
            setSelectedBookingId(parseInt(bookingId));
            setActiveTab('bookings');
            
            const newUrl = window.location.pathname + '?tab=bookings';
            router.replace(newUrl);
            
          } else {
            if (uuid && paymentMethodId) {
              await UpdatePaymentStatusService.updatePaymentFailed(
                uuid,
                parseInt(paymentMethodId),
                { 
                  return_data: Object.fromEntries(params.entries()),
                  status: paymentStatus 
                },
                token || undefined
              );
            }
            
            toast.error('❌ تم إلغاء الدفع أو فشل');
            setActiveTab('bookings');
          }
        } catch (error) {
          console.error('Error handling payment callback:', error);
          toast.error('حدث خطأ في معالجة الدفع');
        } finally {
          setIsProcessingCallback(false);
        }
      }
    };

    handlePaymentCallback();
  }, [router]);

  useEffect(() => {
    // ✅ استخدام URLSearchParams من window.location
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'bookings') {
      setActiveTab('bookings');
    }
  }, []);

  return (
    <div className='min-h-screen bg-white pt-16 lg:pt-24'>
      <div className="container mx-auto px-2 py-3 max-w-6xl lg:p-8 bg-white">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="w-full bg-white p-1 gap-1 lg:gap-3">
            <TabsTrigger 
              value="personal"
              className={cn(
                "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === 'personal'
                  ? "bg-[#012738] text-white shadow-md"
                  : "bg-[#d2d6db6b] text-gray-600 hover:bg-[#D2D6DB] hover:text-gray-800"
              )}
            >
              <h1 className='text-sm lg:text-lg'>المعلومات الشخصية</h1>
            </TabsTrigger>
            <TabsTrigger 
              value="bookings"
              className={cn(
                "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === 'bookings'
                  ? "bg-[#012738] text-white shadow-md"
                  : "bg-[#d2d6db6b] text-gray-600 hover:bg-[#D2D6DB] hover:text-gray-800"
              )}
            >
              <h2 className='text-sm lg:text-lg'>قائمة الحجوزات</h2>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <ProfileInfo />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsList initialBookingId={selectedBookingId} />
          </TabsContent>
        </Tabs>

        {isProcessingCallback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-bold text-gray-800">جاري معالجة الدفع...</h3>
              <p className="text-sm text-gray-500 mt-1">يرجى الانتظار</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}