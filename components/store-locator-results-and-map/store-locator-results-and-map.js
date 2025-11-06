'use client';

import { useContext, useEffect, useRef } from 'react';

import clsx from 'clsx';

import StoreLocatorContext from '@contexts/store-locator';

import { getGeoHash } from '@lib/get-geo-hash';
import normalizeStores from '@lib/normalize-stores';
import { getLocationsToDisplay } from '@lib/store-locations';

import Container from '@components/container/container';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import StoreTilesList from '@components/store-tiles-list/store-tiles-list';

import styles from './store-locator-results-and-map.module.scss';

export default function StoreLocatorResultsAndMap({
  allLocations,
  noPadding,
  onSelect,
}) {
  const resultsRef = useRef(null);
  const {
    allMapLocations,
    filteredStores,
    minHeightLarge,
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
      <Container className={styles.container} noPadding={noPadding}>
        <div className={styles.visualContainer}>
          <div
            className={clsx(styles.results, 'storeSearchResults')}
            ref={resultsRef}
          >
            <StoreTilesList
              allLocations={allLocations}
              filteredStores={filteredStores}
              normalizeStores={normalizeStores}
              onSelect={onSelect}
              selectedStore={selectedStore}
            />
          </div>
          <StoreLocatorMap
            locations={allMapLocations}
            minHeightLarge
            onMarkerClick={setSelectedStore}
          />
        </div>
      </Container>
    </div>
  );
}
