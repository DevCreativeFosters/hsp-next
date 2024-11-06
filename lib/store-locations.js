import { computeDistanceBetween } from 'spherical-geometry-js';

const RADIUS = 150 * 1000; // 150km in meters

export function findLocationsInRadius(center, allLocations) {
  if (!center) {
    return allLocations;
  }

  const locationsWithDistance = allLocations.map(loc => ({
    ...loc,
    distance: Math.round(computeDistanceBetween(center, loc.geolocation)),
  }));

  return locationsWithDistance.filter(({ distance }) => distance <= RADIUS);
}

export function getLocationsToDisplay(center, allLocations) {
  const locationsInRadius = findLocationsInRadius(center, allLocations);
  return locationsInRadius;
}
