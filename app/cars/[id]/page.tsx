import { BookingService } from '@/src/services/bookingService';
import BookingForm from '@/src/components/booking/BookingForm';
import Link from 'next/link';
import { FaArrowCircleRight } from 'react-icons/fa';
import { RiArrowRightSLine } from "react-icons/ri";


interface PageProps {
  params: {
    id: string;
  };
}

export default async function CarBookingPage({ params }: PageProps) {
  const { id } = params;

  // جلب بيانات السيارة
  const car = await BookingService.getCarById(id);

  return (
    <div className="min-h-screen bg-white py-8 px-4 mt-12 lg:mt-16">
      <div className="container mx-auto max-w-7xl">
        <Link href="/" className='flex items-center gap-0.5 my-2 lg:my-5'>
        <RiArrowRightSLine className='text-3xl'/>
         <span className='text-base lg:text-lg text-primary'>تفاصيل</span>
        </Link>
        <BookingForm carId={id} />
      </div>
    </div>
  );
}