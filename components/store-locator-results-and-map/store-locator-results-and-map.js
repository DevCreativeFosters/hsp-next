'use client';

import { useContext, useEffect, useRef } from 'react';

import StoreLocatorContext from '@contexts/store-locator';

import constants from '@lib/constants';
import { getGeoHash } from '@lib/get-geo-hash';
import normalizeStores from '@lib/normalize-stores';
import { getLocationsToDisplay } from '@lib/store-locations';

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
              <>
                <div className={styles.noResultsNotice}>
                  {constants.NO_RESULTS_NOTICE}
                </div>
                {allLocations && (
                  <ul className={styles.resultList}>
                    {(() => {
                      const superStore = allLocations?.find(location =>
                        location.storesCustomFields.storeCategory.includes(
                          'super_store',
                        ),
                      );
                      if (superStore) {
                        const normalizedSuperStore = normalizeStores([
                          superStore,
                        ])[0];
                        return (
                          <StoreTile
                            item={normalizedSuperStore}
                            selected={false}
                          />
                        );
                      }
                    })()}
                  </ul>
                )}
              </>
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
