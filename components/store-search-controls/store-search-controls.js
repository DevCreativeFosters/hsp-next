'use client';

import { useState, useContext, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import {
  getPlaceSuggestions,
  getPlaceGeoLocation,
  stringifySuggestion,
} from '@lib/google-place';
import StoreLocatorContext from '@contexts/store-locator';
import { findLocationsInRadius } from '@lib/store-locations';
import StoreLocatorInput from '@components/store-locator-input/store-locator-input';
import StoreLocatorSuggestions from '@components/store-locator-suggestions/store-locator-suggestions';
import Switch from '@components/form/switch';

import styles from './store-search-controls.module.scss';
import normalizeStores from '@lib/normalize-stores';

export default function StoreSearchControls({
  label = 'Locate your store',
  isWide,
  isHidden,
  interactWithDisabledForm,
  allLocations,
}) {
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const {
    location,
    setLocation,
    searchGeolocation,
    setSearchGeolocation,
    setFilteredLocations,
    selectedStore,
    isMapVisible,
    setMapVisible,
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
    [locationInput, location],
  );

  useEffect(
    function syncStoreLocationResultList() {
      const locationList = normalizeStores(allLocations);
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
    [searchGeolocation, setFilteredLocations, allLocations],
  );

  return (
    <div
      className={clsx(styles.searchControls, {
        [styles.isWide]: isWide,
        [styles.isDisabled]: selectedStore,
        [styles.isHidden]: isHidden,
      })}
      onClick={interactWithDisabledForm}
    >
      <div className={styles.location}>
        <StoreLocatorInput
          type="text"
          name="location"
          label={label}
          placeholder="Your location"
          icon="search"
          withResetButton
          value={locationInput}
          onChange={value => {
            setLocationInput(value);
            if (!value) {
              setLocation(null);
              setSearchGeolocation(null);
            }
          }}
          required
          disabled={selectedStore}
        />
        <StoreLocatorSuggestions
          items={suggestions}
          selectLocation={selectLocation}
        />
      </div>
      <div className={styles.mapToggler}>
        <Switch
          label="Show map"
          state={isMapVisible}
          disabled={selectedStore}
          onChange={() => {
            setMapVisible(!isMapVisible);
          }}
        />
      </div>
    </div>
  );
}
