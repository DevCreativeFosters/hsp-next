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
const RADIUS = 150 * 1000; // 150km
const HSP_HEADQUARTERS_COORDINATES = {
  lat: -37.95347921924772,
  lng: 145.1871773227412,
};

function filterLocationsWithinBounds(bounds, locations) {
  return locations.filter(location => {
    const { lat, lng } = location.geolocation;
    return bounds?.contains(new google.maps.LatLng(lat, lng));
  });
}

export default function StoreLocatorMap({
  className,
  locations = [],
  onMarkerClick,
}) {
  const {
    filteredLocations,
    hasMapInteracted,
    searchGeolocation,
    setFilteredStores,
    setHasMapInteracted,
  } = useContext(StoreLocatorContext);
  const [googleMap, setGoogleMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const center = useMemo(() => {
    return searchGeolocation || HSP_HEADQUARTERS_COORDINATES;
  }, [searchGeolocation]);

  // Separate handler for map interaction
  const handleMapInteraction = useCallback(() => {
    setTimeout(() => {
      setHasMapInteracted(true);
    }, 500);
  }, [setHasMapInteracted]);

  // Handler for bounds update
  const handleMapChange = useCallback(
    map => {
      const bounds = map.getBounds();
      const visibleLocations = locations.filter(location => {
        const { lat, lng } = location.geolocation;
        return bounds?.contains(new google.maps.LatLng(lat, lng));
      });

      setFilteredStores(visibleLocations);
    },
    [locations, setFilteredStores],
  );

  useEffect(
    function loadGoogleMap() {
      let isMounted = true;

      const loader = new Loader({
        apiKey: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ['places'],
        version: 'weekly',
      });

      async function initMap() {
        try {
          await loader.load();

          if (!isMounted) return;

          const mapElement = document.getElementById('store-locator-map');
          if (!mapElement) {
            throw new Error('Map container not found');
          }

          const map = new google.maps.Map(mapElement, {
            backgroundColor: '#000000',
            center: center,
            mapId: NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
            mapTypeControl: false,
            maxZoom: 17,
            minZoom: 1,
            streetViewControl: true,
            zoom: DEFAULT_MAP_ZOOM,
          });

          if (!isMounted) return;
          setGoogleMap(map);
          setIsLoading(false);

          if (searchGeolocation) {
            map.setCenter(searchGeolocation);
          } else {
            // Fit the map to show all locations
            const bounds = new google.maps.LatLngBounds();
            locations.forEach(location => {
              bounds.extend(location.geolocation);
            });
            map.fitBounds(bounds);

            // Wait for the map to finish loading before adjusting zoom
            google.maps.event.addListenerOnce(map, 'idle', () => {
              map.setZoom(map.getZoom());
            });
          }

          // Add specific listeners for user interaction
          map.addListener('dragend', () => handleMapInteraction());

          // Separate listener for bounds update
          map.addListener('bounds_changed', () => handleMapChange(map));
          map.addListener('tilesloaded', () => handleMapChange(map));
          map.addListener('zoom_changed', () => handleMapChange(map));
        } catch (error) {
          setLoadError(error);
        }
      }

      initMap();

      return () => {
        isMounted = false;
      };
    },
    [
      center,
      handleMapChange,
      handleMapInteraction,
      locations,
      searchGeolocation,
    ],
  );

  useEffect(
    function renderMapClustersAndMarkers() {
      if (googleMap) {
        // Clear existing markers
        markers.forEach(marker => marker.setMap(null));

        const newMarkers = locations
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
    [googleMap, handleMapChange, locations, onMarkerClick],
  );

  useEffect(
    function recenterMapOnPlaceGeolocationChange() {
      if (googleMap && searchGeolocation) {
        // Ensure we have locations to show
        const locationsToShow =
          filteredLocations?.length > 0 ? filteredLocations : [];

        if (locationsToShow.length === 0) {
          // Create a circle with 150km radius
          const circle = new google.maps.Circle({
            center: searchGeolocation,
            fillOpacity: 0,
            map: googleMap,
            radius: RADIUS,
            strokeOpacity: 0,
          });

          // Fit the map to the circle bounds
          googleMap.fitBounds(circle.getBounds());

          // Remove the circle after bounds are set
          circle.setMap(null);
          return;
        }

        if (locationsToShow.length === 1 && locationsToShow[0]?.geolocation) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(searchGeolocation);
          bounds.extend(locationsToShow[0].geolocation);

          const padding = { bottom: 50, left: 50, right: 50, top: 50 };
          googleMap.fitBounds(bounds, padding);
        } else {
          // For multiple locations
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(searchGeolocation);
          locationsToShow.forEach(location => {
            if (location?.geolocation) {
              bounds.extend(location.geolocation);
            }
          });

          const padding = { bottom: 50, left: 50, right: 50, top: 50 };
          googleMap.fitBounds(bounds, padding);
        }

        setTimeout(() => {
          handleMapChange(googleMap);
        }, 100);
      }
    },
    [filteredLocations, googleMap, handleMapChange, searchGeolocation],
  );

  return (
    <div className={clsx(styles.mapWrapper, className)}>
      <div className={styles.map} id="store-locator-map" />
    </div>
  );
}
