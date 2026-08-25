/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { CarService } from '@/src/services/carService';
import BookingForm from '@/src/components/booking/BookingForm';
import Link from 'next/link';
import { RiArrowRightSLine } from "react-icons/ri";

export default function CarBookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const id = params.id as string;
  const carId = parseInt(id);
  const officeId = searchParams.get('officeId') ? parseInt(searchParams.get('officeId')!) : null;
  const type = searchParams.get('type') as 'daily' | 'monthly' || 'daily';

  const [carData, setCarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!officeId || isNaN(carId)) {
        setError('بيانات غير صحيحة');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let data;
        if (type === 'daily') {
          
          data = await CarService.getDailyCarDetails(officeId, carId);
        } else {
        
          data = await CarService.getMonthlyCarDetails(officeId, carId);
        }
        setCarData(data);
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('حدث خطأ في تحميل تفاصيل السيارة');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carId, officeId, type]);

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
       
      </div>
    </div>
  );
}


  if (error || !carData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || 'السيارة غير موجودة'}</p>
          <Link href="/" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-xl">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  // تحويل البيانات
  const car = {
    id: carData.id,
    name: carData.name,
    brand: carData.brand?.name || '',
    brandLogo: carData.brand?.image_url || '',
    year: carData.model_year,
    pricePerDay: carData.price_per_day || carData.price_per_month || 0,
    pricePerMonth: carData.price_per_month || 0,
    pricePerDayAfterDiscount: carData.price_per_day_after_discount || carData.price_per_month_after_discount || 0,
    discount: carData.discount || 0,
    image: carData.image_url || '',
    image_url: carData.image_url || '',
    category: carData.brand?.name || '',
    categoryId: carData.brand?.id,
    minimumDays: carData.minimum_days || 3,
    isFeatured: carData.is_featured === 1,
    status: carData.status,
    providerId: carData.office?.id || officeId,
    providerName: carData.office?.name,
    providerImage: carData.office?.image_url,
    acceptanceRate: carData.office?.acceptance_rate,
    customerSatisfactionRate: carData.office?.customer_satisfaction_rate,
    deliverySpeedRate: carData.office?.delivery_speed_rate,
    guarantees: carData.guarantees || [],
    cancellationPolicies: carData.cancellation_policies || [],
    periods: carData.periods || [],
    additionalServices: carData.office?.additional_services || [],
    icons: carData.office?.icons?.map((icon: any) => ({
      id: icon.id,
      title: icon.title,
      image: icon.icon || icon.image,
    })) || [],
    averageRating: carData.office?.average_rating || 0,
    countReviews: carData.office?.count_reviews || 0,
    transmission: carData.transmission || 'أوتوماتيك',
    fuelType: carData.fuel_type || 'بنزين',
    seats: carData.seats || 5,
    doors: carData.doors || 4,
    luggage: carData.luggage || 3,
  };

  const services = carData.office?.additional_services?.map((service: any) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    price: service.price,
    periodType: service.period_type,
    pricePerDay: service.price_per_day,
    isAvailable: service.status === 'active',
    imageUrl: service.image_url,
  })) || [];

  const bookingPeriods = carData.periods?.map((period: any) => ({
    id: period.id,
    label: period.label,
    days: period.days || period.days_count || 30,
    type: period.type,
    price: period.price || period.price_total || 0,
    discount: period.discount || 0,
  })) || [];

  const rentalType = type === 'daily' ? 'يومي' : 'شهري';

  return (
    <div className="min-h-screen bg-white py-8 px-4 mt-12 lg:mt-16">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className='flex items-center gap-0.5 my-2 lg:my-5 hover:text-primary transition-colors'>
          <RiArrowRightSLine className='text-3xl' />
          <span className='text-base lg:text-lg text-primary'>تفاصيل السيارة</span>
          <span className='text-gray-400 mx-1'>/</span>
          <span className='text-base lg:text-lg text-gray-600'>{car.name}</span>
        </Link>

        <BookingForm 
          carId={id} 
          car={car}
          services={services}
          periods={bookingPeriods}
          rentalType={rentalType}
        />
      </div>
    </div>
  );
}