import { toRadians } from '@lib/to-radians';

// Calculate the distance between two points given their latitude and longitude in degrees
// and return the distance in kilometers (Haversine formula)

export function calculateDistance(storeLocation, searchGeolocation) {
  const earthRadiusKm = 6371;

  const dLat = toRadians(searchGeolocation?.lat - storeLocation?.latitude);
  const dLon = toRadians(searchGeolocation?.lng - storeLocation?.longitude);

  const lat1 = toRadians(storeLocation?.latitude);
  const lat2 = toRadians(searchGeolocation?.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  return distance;
}
