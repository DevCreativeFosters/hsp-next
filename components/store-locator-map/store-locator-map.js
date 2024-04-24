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
const RADIUS = 50 * 1000; // [m]
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
  const { searchGeolocation, setFilteredStores } =
    useContext(StoreLocatorContext);
  const [googleMap, setGoogleMap] = useState(null);

  const center = useMemo(() => {
    return searchGeolocation || HSP_HEADQUARTERS_COORDINATES;
  }, [searchGeolocation]);

  const handleMapChange = useCallback(
    map => {
      const bounds = map.getBounds();
      const locationsWithinBounds = filterLocationsWithinBounds(
        bounds,
        locations,
      );
      setFilteredStores(locationsWithinBounds);
    },
    [locations, setFilteredStores],
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

        const circle = new google.maps.Circle({
          center: center,
          fillOpacity: 0,
          map: map,
          radius: RADIUS,
          strokeOpacity: 0,
        });

        map.fitBounds(circle.getBounds());

        map.addListener('tilesloaded', () => handleMapChange(map));
        map.addListener('zoom_changed', () => handleMapChange(map));
        map.addListener('center_changed', () => handleMapChange(map));

        setGoogleMap(map);
      });
    },
    [center, handleMapChange],
  );

  useEffect(
    function renderMapClustersAndMarkers() {
      if (googleMap) {
        let markers = locations
          .map(location => {
            const { geolocation, icon, name } = location;
            if (geolocation?.lat == null || geolocation?.lng == null) {
              return null;
            }

            const marker = new google.maps.Marker({
              icon,
              position: geolocation,
              title: name,
            });

            marker.addListener('click', () => onMarkerClick(location));
            return marker;
          })
          .filter(Boolean);

        new MarkerClusterer({
          map: googleMap,
          markers,
          renderer: {
            render: googleMapsMarkerClusterRenderer,
          },
        });
      }
    },
    [googleMap, locations, onMarkerClick],
  );

  useEffect(
    function recenterMapOnPlaceGeolocationChange() {
      if (googleMap && searchGeolocation) {
        const circle = new google.maps.Circle({
          center: searchGeolocation,
          fillOpacity: 0,
          map: googleMap,
          radius: RADIUS,
          strokeOpacity: 0,
        });
        googleMap.fitBounds(circle.getBounds());
      }
    },
    [googleMap, searchGeolocation],
  );

  return (
    <div className={clsx(styles.mapWrapper, className)}>
      <div className={styles.map} id="store-locator-map" />
    </div>
  );
}
