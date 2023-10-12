'use client';

import { useContext, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { computeDistanceBetween } from 'spherical-geometry-js';
import StoreLocatorContext from '@contexts/store-locator';
import Container from '@components/container/container';
import StoreLocatorResultItem from '@components/store-locator-search/store-locator-result-item';
import ALL_LOCATIONS from '@mockup/store-locations.json';
import styles from './store-locator-results-and-map.module.scss';

const { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY } = process.env;
const { NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID } = process.env;

const allLocationsNormalized = Object.values(ALL_LOCATIONS).map(record => {
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
    address: record.field_cpt_locations_address.replaceAll('\r\n', ''),
    email: record.field_cpt_locations_email,
    geolocation: {
      lat: record.field_cpt_locations_google_map.lat,
      lng: record.field_cpt_locations_google_map.lng,
    },
    tel: record.field_cpt_locations_phone,
    directions_url: '#',
  };
});

export default function StoreLocatorResultsAndMap() {
  const { searchGeolocation, radius } = useContext(StoreLocatorContext);
  const [googleMap, setGoogleMap] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState(
    allLocationsNormalized,
  );

  useEffect(function loadGoogleMap() {
    const loader = new Loader({
      apiKey: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary('maps');

      const map = new Map(document.getElementById('store-locator-map'), {
        center: { lat: -26, lng: 133 },
        // center: { lat: 0, lng: 0 },
        zoom: 4,
        mapId: NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
        mapTypeControl: false,
        // streetViewControl: false,
      });

      setGoogleMap(map);
    });
  }, []);

  useEffect(
    function syncMapMarkers() {
      let markers = [];
      if (googleMap) {
        markers = filteredLocations.map(({ name, geolocation, icon }) => {
          const marker = new google.maps.Marker({
            position: geolocation,
            title: name,
            icon,
          });
          marker.setMap(googleMap);
          return marker;
        });
      }

      return () => {
        markers.map(marker => {
          marker.setMap(null);
        });
      };
    },
    [googleMap, filteredLocations],
  );

  useEffect(
    function recenterMapOnPlaceGeolocationChange() {
      if (googleMap && searchGeolocation) {
        googleMap.setCenter(searchGeolocation);
      }
      return () => {};
    },
    [googleMap, searchGeolocation],
  );

  useEffect(
    function syncMapBoundaries() {
      if (googleMap && searchGeolocation && radius) {
        const locationsWithinRadius = allLocationsNormalized.filter(
          ({ geolocation }) => {
            const distance = computeDistanceBetween(
              searchGeolocation,
              geolocation,
            ); // [meters]
            return distance <= radius * 1000;
          },
        );
        setFilteredLocations(locationsWithinRadius);
      }
      return () => {};
    },
    [googleMap, searchGeolocation, radius],
  );

  return (
    <div className={styles.wrapper} id="store-search">
      <Container className={styles.container}>
        <div className={styles.visualContainer}>
          <div className={styles.results}>
            {filteredLocations.length > 0 ? (
              <ul className={styles.resultList}>
                {filteredLocations.map((result, index) => (
                  <StoreLocatorResultItem item={result} key={index} />
                ))}
              </ul>
            ) : (
              'No results'
            )}
          </div>
          <div className={styles.mapWrapper}>
            <div className={styles.map} id="store-locator-map" />
          </div>
        </div>
      </Container>
    </div>
  );
}
