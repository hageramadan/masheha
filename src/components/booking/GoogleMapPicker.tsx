/// <reference types="google.maps" />
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

// تحميل Google Maps API ديناميكياً
const GOOGLE_MAPS_API_KEY = "AIzaSyBAn_b3jCbl3agJl7CM7WYIHjGWJIExwfQ";

interface GoogleMapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialPosition?: { lat: number; lng: number };
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleMapPicker({
  onLocationSelect,
  initialPosition = { lat: 24.7136, lng: 46.6753 },
  isOpen,
  onClose,
}: GoogleMapPickerProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(
    initialPosition ? { lat: initialPosition.lat, lng: initialPosition.lng } : null
  );
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  // تعريف الدالة أولاً (قبل استخدامها)
  const getAddressFromLatLng = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === 'OK' && results) {
              resolve(results);
            } else {
              reject(new Error('Geocoding failed'));
            }
          }
        );
      });

      if (result && result.length > 0) {
        const formattedAddress = result[0].formatted_address;
        setAddress(formattedAddress);
      } else {
        setAddress(`موقع محدد (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setAddress(`موقع محدد (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadGoogleMapsScript = () => {
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap&loading=async`;
      script.async = true;
      script.defer = true;

      (window as any).initMap = () => {
        setScriptLoaded(true);
      };

      script.onerror = () => {
        console.error('Failed to load Google Maps API');
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);


  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || !isOpen) return;

    const initMap = () => {
      const position = selectedPosition || initialPosition;

      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: position.lat, lng: position.lng },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        mapTypeControl: false,
      });

      mapInstanceRef.current = map;

      
      const marker = new google.maps.Marker({
        position: { lat: position.lat, lng: position.lng },
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });
      markerRef.current = marker;

      
      getAddressFromLatLng(position.lat, position.lng);

      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        if (position) {
          const lat = position.lat();
          const lng = position.lng();
          setSelectedPosition({ lat, lng });
          getAddressFromLatLng(lat, lng);
        }
      });

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        const latLng = e.latLng;
        if (latLng) {
          const lat = latLng.lat();
          const lng = latLng.lng();
          setSelectedPosition({ lat, lng });
          marker.setPosition({ lat, lng });
          getAddressFromLatLng(lat, lng);
        }
      });
    };

   
    const timeoutId = setTimeout(initMap, 100);
    return () => clearTimeout(timeoutId);
  }, [scriptLoaded, isOpen, initialPosition, selectedPosition]); 


  const handleConfirm = () => {
    if (selectedPosition) {
      onLocationSelect(selectedPosition.lat, selectedPosition.lng, address);
      onClose();
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('متصفحك لا يدعم تحديد الموقع');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setSelectedPosition({ lat, lng });
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.panTo({ lat, lng });
          mapInstanceRef.current.setZoom(16);
          markerRef.current.setPosition({ lat, lng });
        }
        getAddressFromLatLng(lat, lng);
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('تعذر الحصول على موقعك الحالي');
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary" />
            اختر موقع الاستلام
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div className="h-125 w-full rounded-xl overflow-hidden border-2 border-gray-200">
            {!scriptLoaded ? (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  {/* <p className="text-gray-600">جاري تحميل الخريطة...</p> */}
                </div>
              </div>
            ) : (
              <div ref={mapRef} className="h-full w-full" />
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-50">
              {address && (
                <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                  <span className="font-medium text-gray-900">العنوان المحدد: </span>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      جاري جلب العنوان...
                    </span>
                  ) : (
                    <span>{address}</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm flex items-center gap-2"
              >
                <span>📍</span>
                موقعي الحالي
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedPosition}
                className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                تأكيد الموقع
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-400 text-center">
            انقر على الخريطة أو اسحب الماركر لتحديد موقع الاستلام
          </div>
        </div>
      </div>
    </div>
  );
}