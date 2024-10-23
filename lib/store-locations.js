import { computeDistanceBetween } from 'spherical-geometry-js';

const RADIUS = 200 * 1000; // 200km in meters

export function findLocationsInRadius(center, allLocations) {
  if (!center) {
    return allLocations;
  }

  const locationsWithDistance = allLocations.map(loc => {
    const locationCopy = { ...loc };
    const distance = computeDistanceBetween(center, locationCopy.geolocation);
    locationCopy.distance = Math.round(distance);
    return locationCopy;
  });

  const locationsInRadius = locationsWithDistance.filter(({ distance }) => {
    return distance <= RADIUS;
  });

  // console.log(`Locations in radius: ${locationsInRadius.length}`);

  if (locationsInRadius.length === 0) {
    const closestLocation = locationsWithDistance.reduce((closest, current) =>
      current.distance < closest.distance ? current : closest,
    );
    // console.log('No locations in radius, returning closest:', closestLocation);
    return [closestLocation];
  }

  return locationsInRadius;
}

export function getLocationsToDisplay(center, allLocations) {
  const locationsInRadius = findLocationsInRadius(center, allLocations);
  return locationsInRadius;
}
