// // src/components/profile/BookingsList.tsx
// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import {
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaChevronRight,
//   FaChevronLeft,
// } from "react-icons/fa";
// import { cn } from "@/src/lib/utils";
// import BookingDetails from "./BookingDetails";
// import { getBookings } from "@/src/services/bookingApiService";
// import { Booking } from "@/src/types/api";
// import { LiaCarSideSolid } from "react-icons/lia";

// function formatDate(dateString: string) {
//   try {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("ar-SA", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   } catch {
//     return dateString;
//   }
// }

// function getStatusLabel(status: string) {
//   const statusMap: Record<string, string> = {
//     pending: "بانتظار الموافقة",
//     confirmed: "مؤكد",
//     completed: "مكتمل",
//     cancelled: "ملغي",
//   };
//   return statusMap[status] || status;
// }

// function getStatusColor(status: string) {
//   const colorMap: Record<string, string> = {
//     pending: "bg-yellow-100 text-yellow-700",
//     confirmed: "bg-green-100 text-green-700",
//     completed: "bg-blue-100 text-blue-700",
//     cancelled: "bg-red-100 text-red-700",
//   };
//   return colorMap[status] || "bg-gray-100 text-gray-700";
// }

// export default function BookingsList() {
//   const [filter, setFilter] = useState<"current" | "finished">("current");
//   const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
//     null,
//   );
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [perPage] = useState(10);

//   async function fetchBookings(status?: string, page: number = 1) {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getBookings(status, page, perPage);
//       if (response.result && response.data.bookings) {
//         setBookings(response.data.bookings);

//         if (response.data.pagination) {
//           setCurrentPage(response.data.pagination.current_page);
//           setTotalPages(response.data.pagination.last_page);
//           setTotalItems(response.data.pagination.total);
//         }
//       } else {
//         setError(response.message || "حدث خطأ في جلب الحجوزات");
//       }
//     } catch (err) {
//       setError("حدث خطأ في الاتصال بالخادم");
//       console.error("Error fetching bookings:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     const statusMap: Record<string, string | undefined> = {
//       current: "current",
//       finished: "finished",
//     };
//     fetchBookings(statusMap[filter], currentPage);
//   }, [filter, currentPage]);

//   useEffect(() => {
//     setIsVisible(false);
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 50);
//     return () => clearTimeout(timer);
//   }, [filter]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   function handleBack() {
//     setSelectedBookingId(null);
//   }

//   function handlePageChange(newPage: number) {
//     if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
//       setCurrentPage(newPage);

//       setIsVisible(false);
//       setTimeout(() => {
//         setIsVisible(true);
//       }, 300);
//     }
//   }

//   if (selectedBookingId) {
//     return <BookingDetails bookingId={selectedBookingId} onBack={handleBack} />;
//   }

//   const startItem = (currentPage - 1) * perPage + 1;
//   const endItem = Math.min(currentPage * perPage, totalItems);

//   return (
//     <div className="space-y-6 bg-white min-h-screen">
//       <div className="flex gap-2 w-full border-b border-gray-200">
//         <button
//           type="button"
//           onClick={() => {
//             setFilter("current");
//             setCurrentPage(1);
//           }}
//           className={cn(
//             "flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 relative",
//             filter === "current"
//               ? "text-[#012738]"
//               : "text-gray-600 hover:text-gray-800",
//           )}
//         >
//           <span>الحالية</span>
//           {filter === "current" && (
//             <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#012738]"></span>
//           )}
//         </button>
//         <button
//           type="button"
//           onClick={() => {
//             setFilter("finished");
//             setCurrentPage(1);
//           }}
//           className={cn(
//             "flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 relative",
//             filter === "finished"
//               ? "text-[#012738]"
//               : "text-gray-600 hover:text-gray-800",
//           )}
//         >
//           <span>المنتهية</span>
//           {filter === "finished" && (
//             <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#012738]"></span>
//           )}
//         </button>
//       </div>

//       {loading && (
//         <div className="text-center py-12">
//           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#012738] border-r-transparent"></div>
//         </div>
//       )}

//       {error && !loading && <></>}

//       {!loading && !error && (
//         <>
//           <div className="space-y-4">
//             {bookings.length > 0 ? (
//               bookings.map((booking, index) => (
//                 <div
//                   key={booking.id}
//                   onClick={() => setSelectedBookingId(booking.id)}
//                   className={cn(
//                     "bg-white rounded-2xl shadow-md border border-gray-100 p-4 hover:shadow-lg hover:border-[#012738]/30 transition-all cursor-pointer",
//                     "transform transition-all duration-500 ease-out",
//                     isVisible
//                       ? "opacity-100 translate-y-0"
//                       : "opacity-0 translate-y-8",
//                   )}
//                   style={{
//                     transitionDelay: `${index * 100}ms`,
//                   }}
//                 >
//                   <div className="flex gap-4">
//                     <div className="w-28 h-24 shrink-0 rounded-xl overflow-hidden">
//                       {booking.car.imageUrl ? (
//                         <Image
//                           src={booking.car.imageUrl}
//                           alt={booking.car.name}
//                           width={112}
//                           height={96}
//                           className="object-contain w-full h-full"
//                           unoptimized
//                         />
//                       ) : (
//                         <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
//                           <LiaCarSideSolid className="text-5xl" />
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex-1 space-y-1 min-w-0">
//                       <div className="flex items-start justify-between gap-2">
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-800 text-base lg:text-lg truncate">
//                             {booking.car.brand.name} {booking.car.name}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {booking.car.model_year}
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-1 shrink-0">
//                           <span className="text-sm lg:text-xl font-bold text-[#012738]">
//                             {booking.total_amount}
//                           </span>
//                           <Image
//                             src="/images/SAR.png"
//                             alt="ريال"
//                             width={20}
//                             height={20}
//                             className="w-4 h-4 lg:w-5 lg:h-5"
//                           />
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2 text-xs text-gray-500">
//                         <FaCalendarAlt className="h-3 w-3 shrink-0" />
//                         <span className="truncate">
//                           {formatDate(booking.start_date)} -{" "}
//                           {formatDate(booking.end_date)}
//                         </span>
//                       </div>

//                       <div className="flex items-center gap-2 text-xs text-gray-500">
//                         <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
//                         <span className="truncate">
//                           {booking.delivery_type === "delivery"
//                             ? "توصيل إلى الموقع"
//                             : "استلام من الفرع"}
//                           {booking.delivery_address &&
//                             ` - ${booking.delivery_address}`}
//                         </span>
//                       </div>

//                       {/* <div className="flex flex-wrap items-center gap-2 mt-1">
//                         <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
//                           {booking.total_days} أيام
//                         </span>
//                         <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
//                           {getStatusLabel(booking.status)}
//                         </span>
//                         <span className="text-xs px-2 py-0.5 bg-blue-50 rounded-full text-blue-700 truncate max-w-[100px]">
//                           {booking.payment_method.name}
//                         </span>
//                       </div> */}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div
//                 className={cn(
//                   "text-center py-16 text-gray-500 transition-all duration-500",
//                   isVisible
//                     ? "opacity-100 translate-y-0"
//                     : "opacity-0 translate-y-8",
//                 )}
//               >
//                 <p className="text-lg font-medium">
//                   لا توجد{" "}
//                   {filter === "current" ? "حجوزات حالية" : "حجوزات منتهية"}
//                 </p>
//               </div>
//             )}
//           </div>

//           {totalPages > 1 && bookings.length > 0 && (
//             <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-200">
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className={cn(
//                     "p-2 rounded-lg border transition-all duration-200",
//                     currentPage === 1
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "bg-white text-[#012738] border-[#012738] hover:bg-[#012738] hover:text-white",
//                   )}
//                   aria-label="الصفحة السابقة"
//                 >
//                   <FaChevronRight className="h-4 w-4" />
//                 </button>

//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }

//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => handlePageChange(pageNum)}
//                         className={cn(
//                           "w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200",
//                           currentPage === pageNum
//                             ? "bg-[#012738] text-white"
//                             : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200",
//                         )}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className={cn(
//                     "p-2 rounded-lg border transition-all duration-200",
//                     currentPage === totalPages
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "bg-white text-[#012738] border-[#012738] hover:bg-[#012738] hover:text-white",
//                   )}
//                   aria-label="الصفحة التالية"
//                 >
//                   <FaChevronLeft className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// src/components/profile/BookingsList.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { cn } from "@/src/lib/utils";
import BookingDetails from "./BookingDetails";
import { getBookings } from "@/src/services/bookingApiService";
import { Booking } from "@/src/types/api";
import { LiaCarSideSolid } from "react-icons/lia";

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function getStatusLabel(status: string) {
  const statusMap: Record<string, string> = {
    pending: "بانتظار الموافقة",
    confirmed: "مؤكد",
    completed: "مكتمل",
    cancelled: "ملغي",
  };
  return statusMap[status] || status;
}

function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return colorMap[status] || "bg-gray-100 text-gray-700";
}

interface BookingsListProps {
  initialBookingId?: number | null;
}

export default function BookingsList({ initialBookingId = null }: BookingsListProps) {
  const [filter, setFilter] = useState<"current" | "finished">("current");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    initialBookingId
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage] = useState(10);

  async function fetchBookings(status?: string, page: number = 1) {
    setLoading(true);
    setError(null);
    try {
      const response = await getBookings(status, page, perPage);
      if (response.result && response.data.bookings) {
        setBookings(response.data.bookings);

        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.current_page);
          setTotalPages(response.data.pagination.last_page);
          setTotalItems(response.data.pagination.total);
        }
      } else {
        setError(response.message || "حدث خطأ في جلب الحجوزات");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const statusMap: Record<string, string | undefined> = {
      current: "current",
      finished: "finished",
    };
    fetchBookings(statusMap[filter], currentPage);
  }, [filter, currentPage]);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  function handleBack() {
    setSelectedBookingId(null);
  }

  function handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      setIsVisible(false);
      setTimeout(() => {
        setIsVisible(true);
      }, 300);
    }
  }

  if (selectedBookingId) {
    return <BookingDetails bookingId={selectedBookingId} onBack={handleBack} />;
  }

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  return (
    <div className="space-y-6 bg-white min-h-screen">
      <div className="flex gap-2 w-full border-b border-gray-200">
        <button
          type="button"
          onClick={() => {
            setFilter("current");
            setCurrentPage(1);
          }}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 relative",
            filter === "current"
              ? "text-[#012738]"
              : "text-gray-600 hover:text-gray-800",
          )}
        >
          <span>الحالية</span>
          {filter === "current" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#012738]"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setFilter("finished");
            setCurrentPage(1);
          }}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 relative",
            filter === "finished"
              ? "text-[#012738]"
              : "text-gray-600 hover:text-gray-800",
          )}
        >
          <span>المنتهية</span>
          {filter === "finished" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#012738]"></span>
          )}
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#012738] border-r-transparent"></div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBookingId(booking.id)}
                  className={cn(
                    "bg-white rounded-2xl shadow-md border border-gray-100 p-4 hover:shadow-lg hover:border-[#012738]/30 transition-all cursor-pointer",
                    "transform transition-all duration-500 ease-out",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8",
                  )}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex gap-4">
                    <div className="w-28 h-24 shrink-0 rounded-xl overflow-hidden">
                      {booking.car.imageUrl ? (
                        <Image
                          src={booking.car.imageUrl}
                          alt={booking.car.name}
                          width={112}
                          height={96}
                          className="object-contain w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                          <LiaCarSideSolid className="text-5xl" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-base lg:text-lg truncate">
                            {booking.car.brand.name} {booking.car.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.car.model_year}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-sm lg:text-xl font-bold text-[#012738]">
                            {booking.total_amount}
                          </span>
                          <Image
                            src="/images/SAR.png"
                            alt="ريال"
                            width={20}
                            height={20}
                            className="w-4 h-4 lg:w-5 lg:h-5"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaCalendarAlt className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {formatDate(booking.start_date)} -{" "}
                          {formatDate(booking.end_date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaMapMarkerAlt className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {booking.delivery_type === "delivery"
                            ? "توصيل إلى الموقع"
                            : "استلام من الفرع"}
                          {booking.delivery_address &&
                            ` - ${booking.delivery_address}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={cn(
                  "text-center py-16 text-gray-500 transition-all duration-500",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8",
                )}
              >
                <p className="text-lg font-medium">
                  لا توجد{" "}
                  {filter === "current" ? "حجوزات حالية" : "حجوزات منتهية"}
                </p>
              </div>
            )}
          </div>

          {totalPages > 1 && bookings.length > 0 && (
            <div className="flex flex-col items-center gap-3 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={cn(
                    "p-2 rounded-lg border transition-all duration-200",
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#012738] border-[#012738] hover:bg-[#012738] hover:text-white",
                  )}
                  aria-label="الصفحة السابقة"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={cn(
                          "w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200",
                          currentPage === pageNum
                            ? "bg-[#012738] text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200",
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "p-2 rounded-lg border transition-all duration-200",
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#012738] border-[#012738] hover:bg-[#012738] hover:text-white",
                  )}
                  aria-label="الصفحة التالية"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}