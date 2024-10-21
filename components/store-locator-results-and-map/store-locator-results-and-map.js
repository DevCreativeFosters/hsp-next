'use client';

import { useContext, useEffect, useRef } from 'react';

import StoreLocatorContext from '@contexts/store-locator';

import { getGeoHash } from '@lib/get-geo-hash';
import normalizeStores from '@lib/normalize-stores';
import {
  getLocationsToDisplay,
} from '@lib/store-locations';

import Container from '@components/container/container';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import StoreTile from '@components/store-tile/store-tile';

import styles from './store-locator-results-and-map.module.scss';

export default function StoreLocatorResultsAndMap({ allLocations }) {
  const resultsRef = useRef(null);
  const {
    allMapLocations,
    filteredLocations,
    filteredStores,
    searchGeolocation,
    selectedStore,
    setAllMapLocations,
    setFilteredLocations,
    setSelectedStore,
  } = useContext(StoreLocatorContext);

  useEffect(
    function setInitialLocationList() {
      const locationList = normalizeStores(allLocations, searchGeolocation);
      setAllMapLocations(locationList);
      setFilteredLocations(locationList);
    },
    [allLocations, searchGeolocation, setAllMapLocations, setFilteredLocations],
  );

  useEffect(
    function scrollToSelectedResultItem() {
      if (selectedStore) {
        const geoHash = getGeoHash(selectedStore.geolocation);
        const item = resultsRef.current.querySelector(`#${geoHash}`);
        if (item) {
          resultsRef.current?.scrollTo({
            behavior: 'smooth',
            top: item.offsetTop,
          });
        }
      }
    },
    [selectedStore],
  );

  useEffect(
    function syncMapBoundaries() {
      const locationList = normalizeStores(allLocations, searchGeolocation);
      setAllMapLocations(locationList); // Keep all locations for the map

      if (searchGeolocation) {
        const locationsToDisplay = getLocationsToDisplay(
          searchGeolocation,
          locationList,
        );
        console.log('Locations to display:', locationsToDisplay.length);
        setFilteredLocations(locationsToDisplay);
      } else {
        setFilteredLocations(locationList);
      }
    },
    [allLocations, searchGeolocation, setAllMapLocations, setFilteredLocations],
  );

  return (
    <div className={styles.wrapper} id="store-search">
      <Container className={styles.container}>
        <div className={styles.visualContainer}>
          <div className={styles.results} ref={resultsRef}>
            {filteredStores.length > 0 ? (
              <ul className={styles.resultList}>
                {filteredStores.map((result, index) => {
                  const isSelected =
                    selectedStore?.geolocation?.lat ===
                      result.geolocation.lat &&
                    selectedStore?.geolocation?.lng === result.geolocation.lng;
                  return (
                    <StoreTile
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
          <StoreLocatorMap
            locations={allMapLocations}
            onMarkerClick={setSelectedStore}
          />
        </div>
      </Container>
    </div>
  );
}
