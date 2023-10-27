'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { googleMapsMarkerClusterRenderer } from '@lib/google-maps-marker-cluster-renderer';
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import StoreLocatorContext from '@contexts/store-locator';
import { findLocationsInRadius } from '@lib/store-locations';
import Container from '@components/container/container';
import ResultItem from '@components/store-locator-search/result-item';
import { allLocations } from '@mockup/store-locations';
import styles from './results-and-map.module.scss';

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;

const DEFAULT_MAP_ZOOM = 4;

export const getHash = location => {
  if (location) {
    const lat = String(location.lat).replace('.', '');
    const lng = String(location.lng).replace('.', '');
    return `geo_${lat}_${lng}`;
  }
};

export default function ResultsAndMap() {
  const resultsRef = useRef(null);
  const { searchGeolocation, radius } = useContext(StoreLocatorContext);
  const [googleMap, setGoogleMap] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState(allLocations);
  const [selectedStoreGeolocation, setSelectedStoreGeolocation] =
    useState(null);

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
        minZoom: 2,
        maxZoom: 17,
        mapTypeControl: false,
        streetViewControl: true,
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
        markers = filteredLocations.map(({ name, geolocation, icon }) => {
          const marker = new google.maps.Marker({
            position: geolocation,
            title: name,
            icon,
          });
          bounds.extend(geolocation);
          marker.addListener('click', () =>
            setSelectedStoreGeolocation(geolocation),
          );
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
        setFilteredLocations(findLocationsInRadius(searchGeolocation, radius));
      } else {
        setFilteredLocations(allLocations);
      }
      return () => {};
    },
    [googleMap, searchGeolocation, radius],
  );

  useEffect(
    function scrollToSelectedResultItem() {
      if (selectedStoreGeolocation) {
        const geoHash = getHash(selectedStoreGeolocation);
        const item = resultsRef.current.querySelector(`#${geoHash}`);
        if (item) {
          resultsRef.current?.scrollTo({
            top: item.offsetTop,
            behavior: 'smooth',
          });
        }
      }
    },
    [selectedStoreGeolocation],
  );

  return (
    <div className={styles.wrapper} id="store-search">
      <Container className={styles.container}>
        <div className={styles.visualContainer}>
          <div className={styles.results} ref={resultsRef}>
            {filteredLocations.length > 0 ? (
              <ul className={styles.resultList}>
                {filteredLocations.map((result, index) => {
                  const isSelected =
                    selectedStoreGeolocation?.lat === result.geolocation.lat &&
                    selectedStoreGeolocation?.lng === result.geolocation.lng;
                  return (
                    <ResultItem
                      item={result}
                      key={index}
                      selected={isSelected}
                    />
                  );
                })}
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
