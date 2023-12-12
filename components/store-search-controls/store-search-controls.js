'use client';

import { useState, useContext, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import {
  getPlaceSuggestions,
  getPlaceGeoLocation,
  stringifySuggestion,
} from '@lib/google-place';
import StoreLocatorContext, { RADIUS_OPTIONS } from '@contexts/store-locator';
import { findLocationsInRadius } from '@lib/store-locations';
import StoreLocatorInput from '@components/store-locator-input/store-locator-input';
import StoreLocatorSuggestions from '@components/store-locator-suggestions/store-locator-suggestions';
import Select from '@components/form/select';
import Switch from '@components/form/switch';
import { allLocations } from '@mockup/store-locations';

import styles from './store-locator-search.module.scss';

export default function StoreSearchControls({ interactWithDisabledForm }) {
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [locationInput, setLocationInput] = useState('');
  const [location, setLocation] = useState(undefined);
  const [suggestions, setSuggestions] = useState([]);

  const {
    searchGeolocation,
    setSearchGeolocation,
    setFilteredLocations,
    selectedStore,
    radius,
    setRadius,
    isMapVisible,
    setMapVisible,
    // resetFilteredLocations,
  } = useContext(StoreLocatorContext);

  const onRadiusChange = useCallback(
    value => {
      setRadius(value);
    },
    [setRadius],
  );

  const selectLocation = useCallback(
    async suggestion => {
      setLocation(suggestion);
      setLocationInput(suggestion.structured_formatting.main_text);
      const placeId = suggestion.place_id;
      setSuggestions([]);
      const geolocation = await getPlaceGeoLocation(placeId, sessionToken);
      setSessionToken(uuidv4());
      setSearchGeolocation(geolocation);
    },
    [sessionToken, setSearchGeolocation],
  );

  // on clear store ?
  // useEffect(
  //   function clearControls() {
  //     if (selectedStore === null) {
  //       setLocation(null);
  //       setLocationInput('');
  //       setSearchGeolocation(null);
  //       setRadius(DEFAULT_RADIUS);
  //       resetFilteredLocations();
  //     }

  //     return () => {};
  //   },
  //   [selectedStore, setRadius, setSearchGeolocation, resetFilteredLocations],
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
      if (searchGeolocation && radius) {
        setFilteredLocations(findLocationsInRadius(searchGeolocation, radius));
      }
      return () => {
        setFilteredLocations(allLocations);
      };
    },
    [searchGeolocation, setFilteredLocations, radius],
  );

  return (
    <div
      className={clsx(styles.searchControls, {
        [styles.isDisabled]: selectedStore,
      })}
      onClick={interactWithDisabledForm}
    >
      <div className={styles.location}>
        <StoreLocatorInput
          type="text"
          name="location"
          label="Locate your store"
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
      <div className={styles.radius}>
        <Select
          id="search-radius"
          size="large"
          placeholder="[Select radius]"
          background="dark"
          suffix="km"
          onChange={onRadiusChange}
          options={RADIUS_OPTIONS}
          value={radius}
          disabled={selectedStore}
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
