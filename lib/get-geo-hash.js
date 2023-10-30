export const getGeoHash = location => {
  if (location) {
    const lat = String(location.lat).replace('.', '');
    const lng = String(location.lng).replace('.', '');
    return `geo_${lat}_${lng}`;
  }
};
