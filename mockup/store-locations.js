import ALL_LOCATIONS from '@mockup/store-locations.json';
import { computeDistanceBetween } from 'spherical-geometry-js';

export const allLocations = Object.values(ALL_LOCATIONS).map(record => {
  let type, icon;
  const title = record.field_location_logo?.title?.toLowerCase();
  if (title?.includes('agent')) {
    type = 'AGENT';
    icon = '/location-pin-agent.svg';
  } else if (title?.includes('store')) {
    type = 'STORE';
    icon = '/location-pin-store.svg';
  } else if (title?.includes('distrbutor')) {
    // ^ typo in the "distrbutor" (missing "i")
    type = 'DISTRIBUTOR';
    icon = '/location-pin-distributor.svg';
  } else if (title?.includes('hsp')) {
    type = 'HSP';
    icon = '/location-pin-hsp.svg';
  } else {
    icon = '/location-pin.svg';
  }

  const street = record.field_cpt_locations_google_map.name;
  const city = record.field_cpt_locations_google_map.city;
  const stateAbbr = record.field_cpt_locations_google_map.state_short;
  const postalCode = record.field_cpt_locations_google_map.post_code;
  const country = record.field_cpt_locations_google_map.country;

  return {
    name: record.title,
    type,
    icon,
    location: {
      street,
      city,
      stateAbbr,
      postalCode,
      country,
    },
    address: record.field_cpt_locations_address.trim().replaceAll('\r\n', ''),
    email: record.field_cpt_locations_email,
    geolocation: {
      lat: record.field_cpt_locations_google_map.lat,
      lng: record.field_cpt_locations_google_map.lng,
    },
    tel: record.field_cpt_locations_phone,
    url: record.url,
    directions_url: '#',
  };
});
