import { allLocations } from '@mockup/store-locations';
import { computeDistanceBetween } from 'spherical-geometry-js';

export function findLocationsInRadius(center, radius) {
  if (!center) {
    return allLocations;
  }

  return allLocations
    .map(loc => {
      const locationCopy = JSON.parse(JSON.stringify(loc));
      const distance = computeDistanceBetween(center, locationCopy.geolocation); // [meters]
      locationCopy.distance = Math.round(distance);
      return locationCopy;
    })
    .filter(({ distance }) => {
      return distance <= radius * 1000;
    })
    .sort((a, b) => {
      return a.distance - b.distance;
    });
}
