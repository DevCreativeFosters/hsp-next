'use client';

import { useContext, useEffect, useRef } from 'react';

import StoreLocatorContext from '@contexts/store-locator';

import constants from '@lib/constants';
import { getGeoHash } from '@lib/get-geo-hash';
import normalizeStores from '@lib/normalize-stores';
import { getLocationsToDisplay } from '@lib/store-locations';

import Container from '@components/container/container';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import StoreTilesList from '@components/store-tiles-list/store-tiles-list';

import styles from './store-locator-results-and-map.module.scss';

export default function StoreLocatorResultsAndMap({ allLocations }) {
  const resultsRef = useRef(null);
  const {
    allMapLocations,
    filteredStores,
    searchGeolocation,
    selectedStore,
    setAllMapLocations,
    setFilteredLocations,
    setSelectedStore,
  } = useContext(StoreLocatorContext);

  useEffect(
    function initializeAndSyncLocations() {
      const locationList = normalizeStores(allLocations, searchGeolocation);
      setAllMapLocations(locationList);

      if (searchGeolocation) {
        const locationsToDisplay = getLocationsToDisplay(
          searchGeolocation,
          locationList,
        );
        setFilteredLocations(locationsToDisplay);
      } else {
        setFilteredLocations(locationList);
      }
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

  return (
    <div className={styles.wrapper} id="store-search">
      <Container className={styles.container}>
        <div className={styles.visualContainer}>
          <div className={styles.results} ref={resultsRef}>
            <StoreTilesList
              allLocations={allLocations}
              filteredStores={filteredStores}
              normalizeStores={normalizeStores}
              selectedStore={selectedStore}
            />
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
