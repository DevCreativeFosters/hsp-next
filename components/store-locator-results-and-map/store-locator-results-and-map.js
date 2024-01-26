'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { findLocationsInRadius } from '@lib/store-locations';
import { getGeoHash } from '@lib/get-geo-hash';
import StoreLocatorContext from '@contexts/store-locator';
import { allLocations } from '@mockup/store-locations';
import Container from '@components/container/container';
import StoreTile from '@components/store-tile/store-tile';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import styles from './store-locator-results-and-map.module.scss';

export default function StoreLocatorResultsAndMap({ stores }) {
  const resultsRef = useRef(null);
  const {
    searchGeolocation,
    filteredLocations,
    setFilteredLocations,
    radius,
    selectedStore,
    setSelectedStore,
    resetFilteredLocations,
  } = useContext(StoreLocatorContext);

  useEffect(
    function scrollToSelectedResultItem() {
      if (selectedStore) {
        const geoHash = getGeoHash(selectedStore.geolocation);
        const item = resultsRef.current.querySelector(`#${geoHash}`);
        if (item) {
          resultsRef.current?.scrollTo({
            top: item.offsetTop,
            behavior: 'smooth',
          });
        }
      }
    },
    [selectedStore],
  );

  useEffect(
    function syncMapBoundaries() {
      if (searchGeolocation && radius) {
        setFilteredLocations(findLocationsInRadius(searchGeolocation, radius));
      } else {
        resetFilteredLocations();
      }
      return () => {};
    },
    [searchGeolocation, radius, resetFilteredLocations, setFilteredLocations],
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
            locations={filteredLocations}
            onMarkerClick={setSelectedStore}
          />
        </div>
      </Container>
    </div>
  );
}
