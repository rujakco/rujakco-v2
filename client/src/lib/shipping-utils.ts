import { SYSTEM } from './config';

export interface ShippingResult {
  cost: number | null;
  label: string;
  isHaversine?: boolean;
}

export interface DistanceResult {
  distance: number;
  isHaversine: boolean;
}

/**
 * Calculate shipping cost based on distance, quantity, provider, and tier
 */
export function calculateShipping(
  distance: number,
  mainQty: number = 1,
  provider: 'lalamove' | 'paxel' = 'lalamove',
  tier: 'reguler' | 'prioritas' = 'reguler'
): ShippingResult {
  const dist = distance || SYSTEM.DEFAULT_DISTANCE || 5;

  if (dist < 0) {
    return { cost: null, label: 'Jarak tidak valid' };
  }

  if (dist > 70) {
    return { cost: null, label: 'Konfirmasi via Concierge' };
  }

  const qty = Math.max(1, mainQty || 1);

  if (provider === 'paxel') {
    const large = Math.floor(qty / 2);
    const med = qty % 2;
    const cost = large * 25000 + med * 20000 + (large + med) * 3000;
    return { cost, label: 'Paxel Ekspres' };
  }

  // Lalamove pricing
  let cost: number;
  if (dist <= 3) {
    cost = 8000;
  } else if (dist <= 10) {
    cost = 8000 + (dist - 3) * 1800;
  } else if (dist <= 20) {
    cost = 20600 + (dist - 10) * 1600;
  } else if (dist <= 30) {
    cost = 36600 + (dist - 20) * 1400;
  } else {
    cost = 50600 + (dist - 30) * 1150;
  }

  if (tier === 'prioritas') {
    cost = Math.round(cost * 1.25);
  }

  return {
    cost,
    label: tier === 'prioritas' ? 'Prioritas' : 'Reguler',
  };
}

/**
 * Calculate Haversine distance (fallback when OSRM fails)
 */
function calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c * 1.35).toFixed(1));
}

/**
 * Get driving distance using OSRM API with Haversine fallback
 */
export async function getDrivingDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Promise<DistanceResult> {
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    throw new Error('Koordinat tidak valid');
  }

  const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) throw new Error('OSRM gagal');

    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      return {
        distance: parseFloat((data.routes[0].distance / 1000).toFixed(1)),
        isHaversine: false,
      };
    }

    throw new Error('Rute jalan raya tidak ditemukan');
  } catch (error) {
    clearTimeout(timeout);
    console.warn('OSRM gagal/timeout, fallback ke Haversine:', error);
    return {
      distance: calculateHaversine(lat1, lon1, lat2, lon2),
      isHaversine: true,
    };
  }
}

/**
 * Search address using OpenStreetMap Nominatim API
 */
export async function searchAddressOSM(
  query: string,
  externalSignal?: AbortSignal
): Promise<any[]> {
  const viewbox = '106.4,-6.6,107.2,-6.0'; // Jabodetabek area
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=id&viewbox=${viewbox}&bounded=1&limit=5`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RujakCo-DeliveryApp/1.0 (halo@rujakco.biz.id)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) return [];

    return await response.json();
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === 'AbortError') return [];
    console.error('Gagal mengambil data lokasi dari OSM:', error);
    return [];
  }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat: number, lon: number): Promise<any | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=id`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RujakCo-DeliveryApp/1.0 (halo@rujakco.biz.id)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    clearTimeout(timeout);
    console.error('Gagal reverse geocode:', error);
    return null;
  }
}

/**
 * Extract short location from full address
 */
export function extractShortLocation(fullAddress: string): string {
  if (!fullAddress) return '';

  const parts = fullAddress.split(',').map((p) => p.trim());

  for (const p of parts) {
    const lower = p.toLowerCase();
    if (lower.includes('kecamatan') || lower.includes('kota') || lower.includes('kabupaten')) {
      const match = p.match(/(?:kecamatan|kota|kabupaten)\s+([^,]+)/i);
      if (match) return match[1].trim();
      return p.replace(/^(kecamatan|kota|kabupaten)\s*/i, '').trim();
    }
  }

  if (parts.length >= 2) return parts[1] || parts[0];
  return parts[0] || '';
}
