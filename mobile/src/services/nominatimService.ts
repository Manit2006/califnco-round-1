/**
 * Free OpenStreetMap / Nominatim Geocoding Service
 * Provides free address lookup, forward geocoding, and reverse geocoding
 * without requiring credit cards or paid Google Maps billing.
 */

export interface GeocodingResult {
  placeId: string;
  displayName: string;
  latitude: number;
  longitude: number;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

// Preset popular delivery hubs for instant selection & offline resilience
export const POPULAR_DELIVERY_HUBS = [
  {
    name: 'Bengaluru Tech Corridor, Karnataka',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    name: 'Navi Mumbai Vashi Industrial Estate, Maharashtra',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    pincode: '400703',
    latitude: 19.0760,
    longitude: 72.8777,
  },
  {
    name: 'South Delhi Malviya Nagar, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110017',
    latitude: 28.5284,
    longitude: 77.2081,
  },
  {
    name: 'Surat Ring Road Commercial Hub, Gujarat',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395002',
    latitude: 21.1702,
    longitude: 72.8311,
  },
  {
    name: 'Hyderabad HITEC City, Telangana',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    latitude: 17.4474,
    longitude: 78.3762,
  },
];

export async function searchAddressOpenStreetMap(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 3) return [];

  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&countrycodes=in&addressdetails=1&limit=5`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CalifncoWaterApp/1.0 (water-purifiers@califnco.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      placeId: String(item.place_id),
      displayName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: {
        road: item.address?.road,
        suburb: item.address?.suburb,
        city: item.address?.city || item.address?.town || item.address?.state_district,
        state: item.address?.state,
        postcode: item.address?.postcode,
        country: item.address?.country,
      },
    }));
  } catch (err) {
    console.warn('OpenStreetMap live fetch failed or offline, using fallback catalog hubs:', err);
    // Graceful offline fallback
    const lower = query.toLowerCase();
    const matched = POPULAR_DELIVERY_HUBS.filter(
      (h) =>
        h.name.toLowerCase().includes(lower) ||
        h.city.toLowerCase().includes(lower) ||
        h.pincode.includes(lower)
    );

    return matched.map((m, idx) => ({
      placeId: 'hub-' + idx,
      displayName: m.name,
      latitude: m.latitude,
      longitude: m.longitude,
      address: {
        city: m.city,
        state: m.state,
        postcode: m.pincode,
        country: 'India',
      },
    }));
  }
}

export async function reverseGeocodeOpenStreetMap(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CalifncoWaterApp/1.0 (water-purifiers@califnco.com)',
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.display_name;
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
  }
  return `Location at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}
