'use client';

import { useCallback, useContext, useEffect, useState } from 'react';

import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';

import StoreLocatorContext from '@contexts/store-locator';

import {
  getPlaceGeoLocation,
  getPlaceSuggestions,
  stringifySuggestion,
} from '@lib/google-place';
import normalizeStores from '@lib/normalize-stores';
import { findLocationsInRadius } from '@lib/store-locations';

import Switch from '@components/form/switch';
import StoreLocatorInput from '@components/store-locator-input/store-locator-input';
import StoreLocatorSuggestions from '@components/store-locator-suggestions/store-locator-suggestions';

import styles from './store-search-controls.module.scss';

export default function StoreSearchControls({
  allLocations,
  interactWithDisabledForm,
  isSearchHidden,
  isWide,
  label = 'Locate your store',
  setShowLocationError,
  showLocationError,
}) {
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const {
    isMapVisible,
    location,
    searchGeolocation,
    selectedStore,
    setFilteredLocations,
    setLocation,
    setMapVisible,
    setSearchGeolocation,
  } = useContext(StoreLocatorContext);

  const selectLocation = useCallback(
    async suggestion => {
      setLocation(suggestion);
      setLocationInput(suggestion.description);
      const placeId = suggestion.place_id;
      setSuggestions([]);
      const geolocation = await getPlaceGeoLocation(placeId, sessionToken);
      setSessionToken(uuidv4());
      setSearchGeolocation(geolocation);
    },
    [sessionToken, setLocation, setSearchGeolocation],
  );

  // on clear store ?
  // useEffect(
  //   function clearControls() {
  //     if (selectedStore === null) {
  //       setLocation(null);
  //       setLocationInput('');
  //       setSearchGeolocation(null);
  //     }

  //     return () => {};
  //   },
  //   [selectedStore, setSearchGeolocation],
  // );

  const handleInputChange = value => {
    setLocationInput(value);
    if (!value) {
      setLocation(null);
      setSearchGeolocation(null);
    }
    setShowLocationError(false);
  };

  useEffect(
    function toggleSuggestions() {
      let isMounted = true;
      if (locationInput) {
        if (!location || stringifySuggestion(location) !== locationInput) {
          const fetchSuggestions = async () => {
            const predictions = await getPlaceSuggestions(locationInput);
            if (isMounted) {
              setSuggestions(predictions);
            }
          };
          fetchSuggestions().catch(console.error);
        }
      } else {
        setSuggestions([]);
      }

      return () => {
        isMounted = false;
      };
    },
    [location, locationInput],
  );

  useEffect(
    function syncStoreLocationResultList() {
      const locationList = normalizeStores(allLocations, searchGeolocation);
      if (searchGeolocation) {
        setFilteredLocations(
          findLocationsInRadius(searchGeolocation, locationList),
        );
      } else {
        setFilteredLocations(locationList);
      }
      return () => {
        setFilteredLocations(locationList);
      };
    },
    [allLocations, searchGeolocation, setFilteredLocations],
  );

  return (
    <div
      className={clsx(styles.searchControls, {
        [styles.isWide]: isWide,
      })}
      onClick={interactWithDisabledForm}
    >
      {!isSearchHidden && (
        <div className={styles.location}>
          <StoreLocatorInput
            className={showLocationError ? styles.errorInput : ''}
            disabled={selectedStore}
            icon="search"
            label={label}
            name="location"
            onChange={handleInputChange}
            placeholder="Your location"
            required
            type="text"
            value={locationInput}
            withResetButton
          />
          {showLocationError && (
            <div className={styles.errorMessage}>
              Please enter your location
            </div>
          )}
          <StoreLocatorSuggestions
            items={suggestions}
            selectLocation={selectLocation}
          />
        </div>
      )}
      <div className={styles.mapToggler}>
        <Switch
          label="Show map"
          onChange={() => {
            setMapVisible(!isMapVisible);
          }}
          state={isMapVisible}
        />
      </div>
    </div>
  );
}
