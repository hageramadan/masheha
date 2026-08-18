// app/profile/page.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/ui/tabs';
import ProfileInfo from '@/src/components/profile/ProfileInfo';
import BookingsList from '@/src/components/profile/BookingsList';
import { cn } from '@/src/lib/utils';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className='bg-white pt-16 lg:pt-24'>
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
            <h1 className='text-sm lg:text-lg'>  المعلومات الشخصية</h1>
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
               <h2 className='text-sm lg:text-lg'>   قائمة الحجوزات</h2>
           
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <ProfileInfo />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}