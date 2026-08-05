import React, { createContext, useContext, useState, useCallback } from 'react';
import { SYSTEM } from '@/lib/config';
import { getDrivingDistance, searchAddressOSM, reverseGeocode, extractShortLocation } from '@/lib/shipping-utils';

export interface DeliveryState {
  selectedDistrict: string;
  selectedDistrictFull: string;
  userDistance: number | null;
  shippingProvider: 'lalamove' | 'paxel';
  tier: 'reguler' | 'prioritas';
  haversineUsed: boolean;
  isLoadingLocation: boolean;
  isSearchingAddress: boolean;
}

interface DeliveryContextType {
  state: DeliveryState;
  setSelectedDistrict: (district: string) => void;
  setSelectedDistrictFull: (district: string) => void;
  setUserDistance: (distance: number | null) => void;
  setShippingProvider: (provider: 'lalamove' | 'paxel') => void;
  setTier: (tier: 'reguler' | 'prioritas') => void;
  setHaversineUsed: (used: boolean) => void;
  setIsLoadingLocation: (loading: boolean) => void;
  setIsSearchingAddress: (searching: boolean) => void;
  requestLocation: () => Promise<{ lat: number; lon: number } | null>;
  searchAddress: (query: string, signal?: AbortSignal) => Promise<any[]>;
  resolveDistance: (lat: number, lon: number) => Promise<void>;
  resetDelivery: () => void;
}

const DeliveryContext = createContext<DeliveryContextType | null>(null);

const initialState: DeliveryState = {
  selectedDistrict: 'Bekasi',
  selectedDistrictFull: '',
  userDistance: null,
  shippingProvider: 'lalamove',
  tier: 'reguler',
  haversineUsed: false,
  isLoadingLocation: false,
  isSearchingAddress: false,
};

export function DeliveryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DeliveryState>(initialState);

  const setSelectedDistrict = useCallback((district: string) => {
    setState((prev) => ({ ...prev, selectedDistrict: district }));
  }, []);

  const setSelectedDistrictFull = useCallback((district: string) => {
    setState((prev) => ({ ...prev, selectedDistrictFull: district }));
  }, []);

  const setUserDistance = useCallback((distance: number | null) => {
    setState((prev) => ({ ...prev, userDistance: distance }));
  }, []);

  const setShippingProvider = useCallback((provider: 'lalamove' | 'paxel') => {
    setState((prev) => ({ ...prev, shippingProvider: provider }));
  }, []);

  const setTier = useCallback((tier: 'reguler' | 'prioritas') => {
    setState((prev) => ({ ...prev, tier }));
  }, []);

  const setHaversineUsed = useCallback((used: boolean) => {
    setState((prev) => ({ ...prev, haversineUsed: used }));
  }, []);

  const setIsLoadingLocation = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoadingLocation: loading }));
  }, []);

  const setIsSearchingAddress = useCallback((searching: boolean) => {
    setState((prev) => ({ ...prev, isSearchingAddress: searching }));
  }, []);

  const requestLocation = useCallback(async (): Promise<{ lat: number; lon: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error('Geolocation not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          console.error('Geolocation error:', err);
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const searchAddress = useCallback(
    async (query: string, signal?: AbortSignal): Promise<any[]> => {
      if (!query || query.length < 3) return [];
      setIsSearchingAddress(true);
      try {
        const results = await searchAddressOSM(query, signal);
        return results;
      } finally {
        setIsSearchingAddress(false);
      }
    },
    []
  );

  const resolveDistance = useCallback(
    async (lat: number, lon: number): Promise<void> => {
      setIsLoadingLocation(true);
      try {
        const result = await getDrivingDistance(SYSTEM.STORE_LAT, SYSTEM.STORE_LNG, lat, lon);
        setUserDistance(result.distance);
        setHaversineUsed(result.isHaversine);
      } catch (error) {
        console.error('Failed to resolve distance:', error);
      } finally {
        setIsLoadingLocation(false);
      }
    },
    []
  );

  const resetDelivery = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <DeliveryContext.Provider
      value={{
        state,
        setSelectedDistrict,
        setSelectedDistrictFull,
        setUserDistance,
        setShippingProvider,
        setTier,
        setHaversineUsed,
        setIsLoadingLocation,
        setIsSearchingAddress,
        requestLocation,
        searchAddress,
        resolveDistance,
        resetDelivery,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) throw new Error('useDelivery must be used within DeliveryProvider');
  return context;
}
