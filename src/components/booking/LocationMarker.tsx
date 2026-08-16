"use client";

import { useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";

interface LocationMarkerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function LocationMarker({ onLocationSelect }: LocationMarkerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}