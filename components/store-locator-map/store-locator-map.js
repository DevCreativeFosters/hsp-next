import StoreLocatorContext from '@contexts/store-locator';
import { useContext, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { googleMapsMarkerClusterRenderer } from '@lib/google-maps-marker-cluster-renderer';
import styles from '@components/store-locator-map/store-locator-map.module.scss';

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

const DEFAULT_MAP_ZOOM = 4;

export default function StoreLocatorMap({ locations, onMarkerClick }) {
  const { searchGeolocation } = useContext(StoreLocatorContext);
  const [googleMap, setGoogleMap] = useState(null);

  useEffect(function loadGoogleMap() {
    const loader = new Loader({
      apiKey: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary('maps');

      const map = new Map(document.getElementById('store-locator-map'), {
        center: { lat: -26, lng: 133 },
        zoom: 4,
        mapId: NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
        minZoom: 1,
        maxZoom: 17,
        mapTypeControl: false,
        streetViewControl: true,
        backgroundColor: '#000000',
      });

      setGoogleMap(map);
    });
  }, []);

  useEffect(
    function renderMapClustersAndMarkers() {
      let markers = [];
      let markerCluster;
      if (googleMap) {
        const bounds = new google.maps.LatLngBounds();
        markers = locations.map(location => {
          const { name, geolocation, icon } = location;
          const marker = new google.maps.Marker({
            position: geolocation,
            title: name,
            icon,
          });
          bounds.extend(geolocation);
          marker.addListener('click', () => onMarkerClick(location));
          return marker;
        });

        markerCluster = new MarkerClusterer({
          map: googleMap,
          markers,
          renderer: {
            render: googleMapsMarkerClusterRenderer,
          },
        });

        if (markers.length) {
          googleMap.fitBounds(bounds);
        } else {
          googleMap.setCenter(searchGeolocation);
          googleMap.setZoom(DEFAULT_MAP_ZOOM);
        }
      }

      return () => {
        markers.map(marker => {
          marker.setMap(null);
        });
        markerCluster?.clearMarkers();
      };
    },
    [googleMap, locations, onMarkerClick, searchGeolocation],
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

  return (
    <div className={styles.mapWrapper}>
      <div className={styles.map} id="store-locator-map" />
    </div>
  );
}
