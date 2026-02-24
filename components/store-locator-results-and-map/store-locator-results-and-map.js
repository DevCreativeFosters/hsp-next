'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import StoreLocatorContext from '@contexts/store-locator';

import { getGeoHash } from '@lib/get-geo-hash';
import normalizeStores from '@lib/normalize-stores';
import { getLocationsToDisplay } from '@lib/store-locations';

import Container from '@components/container/container';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import StoreLocatorSearch from '@components/store-locator-search/store-locator-search';
import StoreTilesList from '@components/store-tiles-list/store-tiles-list';

import FilterIconSvg from '@assets/icons/filter-button.svg';

import styles from './store-locator-results-and-map.module.scss';

export default function StoreLocatorResultsAndMap({
  allLocations,
  hideOnMobile,
  label,
  noPadding,
  onSelect,
  showFilters,
  showStoreLocatorSearch = false,
}) {
  const resultsRef = useRef(null);
  const filterRef = useRef(null); // Ref for outside click detection

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Store multiple selected options in an array
  const [selectedOptions, setSelectedOptions] = useState([]);

  const {
    allMapLocations,
    filteredStores,
    searchGeolocation,
    selectedStore,
    setAllMapLocations,
    setFilteredLocations,
    setSelectedStore,
  } = useContext(StoreLocatorContext);

  const [options, setOptions] = useState([]);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(
    function initializeAndSyncLocations() {
      const locationList = normalizeStores(allLocations, searchGeolocation);

      const uniqueCategories = [
        ...new Set(
          locationList
            .flatMap(store =>
              store.displays?.map(d => d.productCategory?.nodes[0]?.name),
            )
            .filter(Boolean),
        ),
      ];

      setOptions(uniqueCategories);

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

  // Toggle selection in the array
  const handleCheckboxChange = option => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option],
    );
  };

  useEffect(() => {
    function filterStores() {
      if (!selectedOptions.length) return;

      const filtered = filteredStores.filter(store => {
        const storeCategories =
          store.displays
            ?.map(d => d.productCategory?.nodes[0]?.name)
            .filter(Boolean) || [];

        // Match if store has ANY selected option
        return selectedOptions.some(option => storeCategories.includes(option));
      });

      setFilteredLocations(filtered);
    }

    filterStores();
  }, [selectedOptions]);

  return (
    <div
      className={clsx({
        [styles.wrapper]: hideOnMobile,
      })}
      id="store-search"
    >
      <Container className={styles.container} noPadding={noPadding}>
        <div className={styles.visualContainer}>
          <div
            className={clsx(styles.results, 'storeSearchResults')}
            ref={resultsRef}
          >
            {label && <h1 className={styles.label}>{label}</h1>}
            {showStoreLocatorSearch && (
              <StoreLocatorSearch
                addClass={'insideResultsAndMap'}
                allLocations={allLocations}
                noPadding
                showInlineResultList={false}
              />
            )}

            {showFilters && (
              <div className={styles.filterData}>
                <div className={styles.dataWrap}>
                  <div className={styles.left}>
                    {filteredStores?.length || 0} Stores Near You
                  </div>

                  {/* Wrapped in ref for outside click detection */}
                  <div className={styles.right} ref={filterRef}>
                    <button
                      className={clsx(
                        styles.filterBtn,
                        isFilterOpen && styles.active,
                      )}
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                      {isFilterOpen ? 'Close' : 'Filter by In-Store Display'}
                      {isFilterOpen ? (
                        <span className={styles.closeIcon}>✕</span>
                      ) : (
                        <FilterIconSvg />
                      )}
                    </button>

                    {isFilterOpen && (
                      <div className={styles.filterOptionsContainer}>
                        <ul className={styles.filterList}>
                          {options.map(option => (
                            <li className={styles.filterListItem} key={option}>
                              <label className={styles.checkboxLabel}>
                                <input
                                  checked={selectedOptions.includes(option)}
                                  onChange={() => handleCheckboxChange(option)}
                                  type="checkbox"
                                />
                                <span className={styles.optionText}>
                                  {option}
                                </span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

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
