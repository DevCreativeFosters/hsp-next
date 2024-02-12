import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
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
  locations = [],
  onMarkerClick,
  className,
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
            center: center,
            zoom: DEFAULT_MAP_ZOOM,
            mapId: NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
            minZoom: 1,
            maxZoom: 17,
            mapTypeControl: false,
            streetViewControl: true,
            backgroundColor: '#000000',
          },
        );

        const circle = new google.maps.Circle({
          strokeOpacity: 0,
          fillOpacity: 0,
          map: map,
          center: center,
          radius: RADIUS,
        });

        map.fitBounds(circle.getBounds());

        map.addListener('tilesloaded', () => handleMapChange(map));
        map.addListener('zoom_changed', () => handleMapChange(map));
        map.addListener('center_changed', () => handleMapChange(map));

        setGoogleMap(map);
      });
    },
    [handleMapChange, center],
  );

  useEffect(
    function renderMapClustersAndMarkers() {
      if (googleMap) {
        let markers = locations
          .map(location => {
            const { name, geolocation, icon } = location;
            if (geolocation?.lat == null || geolocation?.lng == null) {
              return null;
            }

            const marker = new google.maps.Marker({
              position: geolocation,
              title: name,
              icon,
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
          map: googleMap,
          center: searchGeolocation,
          radius: RADIUS,
          strokeOpacity: 0,
          fillOpacity: 0,
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
