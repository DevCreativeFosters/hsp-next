import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import clsx from 'clsx';

import StoreLocatorContext from '@contexts/store-locator';

import { googleMapsMarkerClusterRenderer } from '@lib/google-maps-marker-cluster-renderer';

import styles from '@components/store-locator-map/store-locator-map.module.scss';

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

const DEFAULT_MAP_ZOOM = 11;
const RADIUS = 100 * 1000; // 100km in meters
const HSP_HEADQUARTERS_COORDINATES = {
  lat: -37.95347921924772,
  lng: 145.1871773227412,
};

// const INITIAL_ZOOM_ADJUSTMENT = 0; // Zoom in by one step

function filterLocationsWithinBounds(bounds, locations) {
  return locations.filter(location => {
    const { lat, lng } = location.geolocation;
    return bounds?.contains(new google.maps.LatLng(lat, lng));
  });
}

export default function StoreLocatorMap({ className, onMarkerClick }) {
  const {
    allMapLocations,
    filteredLocations,
    searchGeolocation,
    setFilteredStores,
  } = useContext(StoreLocatorContext);

  const [googleMap, setGoogleMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const center = useMemo(() => {
    return searchGeolocation || HSP_HEADQUARTERS_COORDINATES;
  }, [searchGeolocation]);

  const handleMapChange = useCallback(
    map => {
      const bounds = map.getBounds();
      const visibleLocations = allMapLocations.filter(location => {
        const { lat, lng } = location.geolocation;
        return bounds?.contains(new google.maps.LatLng(lat, lng));
      });
      // console.log(
      //   'Map change - All locations visible in current map view:',
      //   visibleLocations.length,
      // );
      // console.log('Map change - Total locations:', allMapLocations.length);
      setFilteredStores(visibleLocations);
    },
    [allMapLocations, setFilteredStores],
  );

  useEffect(
    function loadGoogleMap() {
      const loader = new Loader({
        apiKey: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
      });

      loader.load().then(() => {
        const map = new google.maps.Map(
          document.getElementById('store-locator-map'),
          {
            backgroundColor: '#000000',
            center: center,
            mapId: NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
            mapTypeControl: false,
            maxZoom: 17,
            minZoom: 1,
            streetViewControl: true,
            zoom: DEFAULT_MAP_ZOOM,
          },
        );

        if (searchGeolocation) {
          map.setCenter(searchGeolocation);
        } else {
          // Fit the map to show all locations
          const bounds = new google.maps.LatLngBounds();
          allMapLocations.forEach(location => {
            bounds.extend(location.geolocation);
          });
          map.fitBounds(bounds);

          // Wait for the map to finish loading before adjusting zoom
          google.maps.event.addListenerOnce(map, 'idle', () => {
            map.setZoom(map.getZoom());
          });
        }

        map.addListener('tilesloaded', () => handleMapChange(map));
        map.addListener('zoom_changed', () => handleMapChange(map));
        map.addListener('center_changed', () => handleMapChange(map));

        setGoogleMap(map);
      });
    },
    [allMapLocations, center, handleMapChange, searchGeolocation],
  );

  useEffect(
    function renderMapClustersAndMarkers() {
      if (googleMap) {
        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));

        const newMarkers = allMapLocations
          .map(location => {
            const { geolocation, icon, name } = location;
            if (geolocation?.lat == null || geolocation?.lng == null) {
              return null;
            }

            const marker = new google.maps.Marker({
              icon,
              map: googleMap,
              position: geolocation,
              title: name,
            });

            marker.addListener('click', () => onMarkerClick(location));
            return marker;
          })
          .filter(Boolean);

        setMarkers(newMarkers);

        new MarkerClusterer({
          map: googleMap,
          markers: newMarkers,
          renderer: {
            render: googleMapsMarkerClusterRenderer,
          },
        });

        // Trigger handleMapChange to update filtered stores
        handleMapChange(googleMap);
      }
    },
    [allMapLocations, googleMap, handleMapChange, onMarkerClick],
  );

  useEffect(
    function recenterMapOnPlaceGeolocationChange() {
      if (googleMap && searchGeolocation) {
        // console.log(
        //   'Recentering map - Filtered locations:',
        //   filteredLocations.length,
        // );
        // console.log(
        //   'Recentering map - Total locations:',
        //   allMapLocations.length,
        // );

        const locationsToShow =
          filteredLocations.length > 0
            ? filteredLocations
            : [allMapLocations[0]];

        if (locationsToShow.length === 1) {
          // If there's only one location, fit the map to show both the search location and the store
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(searchGeolocation);
          bounds.extend(locationsToShow[0].geolocation);
          googleMap.fitBounds(bounds);

          // Add some padding to the bounds
          const padding = { bottom: 50, left: 50, right: 50, top: 50 };
          googleMap.fitBounds(bounds, padding);
        } else {
          // For multiple locations, use the circle method
          const circle = new google.maps.Circle({
            center: searchGeolocation,
            fillOpacity: 0,
            map: googleMap,
            radius: RADIUS,
            strokeOpacity: 0,
          });
          googleMap.fitBounds(circle.getBounds());
        }

        // Trigger handleMapChange after the map has been recentered
        setTimeout(() => {
          // console.log('Delayed map change trigger');
          handleMapChange(googleMap);
        }, 100);
      }
    },
    [
      allMapLocations,
      filteredLocations,
      googleMap,
      handleMapChange,
      searchGeolocation,
    ],
  );

  return (
    <div className={clsx(styles.mapWrapper, className)}>
      <div className={styles.map} id="store-locator-map" />
    </div>
  );
}
