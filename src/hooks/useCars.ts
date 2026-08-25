'use client';

import { useState, useEffect, useCallback } from 'react';
import { Car } from '@/src/types/car';
import { CarService } from '@/src/services/carService';

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await CarService.getDailyCars();
      setCars(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل السيارات');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const getCarById = useCallback((id: string | number) => {
    return cars.find(car => car.id === id) || null;
  }, [cars]);

  const getFilteredCars = useCallback((filters: {
    category?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    return cars.filter(car => {
      let match = true;
      
      if (filters.category && car.category !== filters.category) {
        match = false;
      }
      
      if (filters.city && car.providerName && !car.providerName.includes(filters.city)) {
        match = false;
      }
      
      if (filters.minPrice && car.pricePerDay < filters.minPrice) {
        match = false;
      }
      
      if (filters.maxPrice && car.pricePerDay > filters.maxPrice) {
        match = false;
      }
      
      return match;
    });
  }, [cars]);

  return {
    cars,
    loading,
    error,
    fetchCars,
    getCarById,
    getFilteredCars,
  };
};