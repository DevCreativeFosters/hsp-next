'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import StoreLocatorContext, { RADIUS_OPTIONS } from '@contexts/store-locator';
import useMobileVh from '@hooks/useMobileVh';
import { findLocationsInRadius } from '@lib/store-locations';
import Input from '@components/enquiry-form/input';
import Suggestions from '@components/enquiry-form/suggestions';
import Select from '@components/form/select';
import Switch from '@components/form/switch';
import StoreList from '@components/store-list/store-list';
import Button from '@components/button/button';
import styles from './index.module.scss';

function stringifySuggestion(suggestion) {
  return suggestion.structured_formatting?.main_text;
}

const FETCH_CONFIG = {
  method: 'GET',
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json' },
};

const OPTIONS_PRODUCTS = [
  {
    label: 'Premium 1PCE Hard Lid',
    value: 'premium-1pce-hard-lid',
  },
];

const SELECTED_PRODUCT = OPTIONS_PRODUCTS[0];

const LOCATIONS_CHUNK_SIZE = 5;

export default function EnquiryForm() {
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [isFormValid, setIsFormValid] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState(undefined);
  const [filteredLocations, setFilteredLocations] = useState(null);
  const [maxResults, setMaxResults] = useState(LOCATIONS_CHUNK_SIZE);
  const [currentResult, setCurrentResult] = useState(null);
  const wrapperOuterRef = useRef(null);
  const formRef = useRef(null);

  const { searchGeolocation, setSearchGeolocation, radius, setRadius } =
    useContext(StoreLocatorContext);

  const isInlineResultListVisible = Boolean(
    location && searchGeolocation && radius,
  );

  const onAnyInputChange = useCallback(ev => {
    setIsFormValid(formRef.current?.checkValidity());
  }, []);

  const getSuggestions = useCallback(
    async searchString => {
      const url = '/api/place-autocomplete';
      const params = [`q=${searchString}`, `sessiontoken=${sessionToken}`]
        .filter(Boolean)
        .join('&');
      try {
        const response = await fetch(`${url}?${params}`, FETCH_CONFIG);
        const responseResolved = await response.json();
        return responseResolved?.predictions;
      } catch (err) {
        console.log('err', err);
      }
    },
    [sessionToken],
  );

  const getDetails = useCallback(
    async placeId => {
      const url = '/api/place-details';
      const params = [`place_id=${placeId}`, `sessiontoken=${sessionToken}`]
        .filter(Boolean)
        .join('&');
      try {
        const response = await fetch(`${url}?${params}`, FETCH_CONFIG);
        return await response.json();
      } catch (err) {
        console.log('err', err);
      }
    },
    [sessionToken],
  );

  const selectLocation = useCallback(
    async suggestion => {
      setLocation(suggestion);
      setLocationInput(suggestion.structured_formatting.main_text);
      const placeId = suggestion.place_id;
      setSuggestions([]);
      const placeDetails = await getDetails(placeId);
      const geolocation = placeDetails?.result?.geometry?.location;
      setSessionToken(uuidv4());
      setSearchGeolocation(geolocation);
    },
    [getDetails, setSearchGeolocation],
  );

  const onRadiusChange = useCallback(value => {
    setRadius(value);
  }, []);

  useEffect(
    function toggleSuggestions() {
      let isMounted = true;
      if (locationInput) {
        if (!location || stringifySuggestion(location) !== locationInput) {
          const fetchSuggestions = async () => {
            const predictions = await getSuggestions(locationInput);
            if (isMounted) {
              console.log('predictions', predictions);
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
    [locationInput, location, getSuggestions],
  );

  useEffect(
    function syncStoreLocationResultList() {
      if (searchGeolocation && radius) {
        setFilteredLocations(findLocationsInRadius(searchGeolocation, radius));
      }
      return () => {
        setFilteredLocations([]);
      };
    },
    [searchGeolocation, radius],
  );

  return (
    <section className={styles.wrapper} ref={wrapperOuterRef}>
      <form
        action="#"
        className={styles.form}
        onChange={onAnyInputChange}
        ref={formRef}
        autoComplete="off"
      >
        <Select
          size="large"
          placeholder="Variant"
          label="Variant"
          options={OPTIONS_PRODUCTS}
          selected={SELECTED_PRODUCT.value}
        />

        <div className={styles.searchControls}>
          <div className={styles.location}>
            <Input
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
            />

            <Suggestions items={suggestions} selectLocation={selectLocation} />
          </div>
          <div className={styles.radius}>
            <Select
              size="large"
              placeholder="[Select radius]"
              background="dark"
              suffix="km"
              onChange={onRadiusChange}
              options={RADIUS_OPTIONS}
              selected={radius}
            />
          </div>
          <div className={styles.mapToggler}>
            <Switch label="Show map" />
          </div>
        </div>

        <StoreList
          className={styles.results}
          items={filteredLocations}
          limit={maxResults}
          show={isInlineResultListVisible}
          onSelect={item => {
            console.log('X');
            setCurrentResult(item);
          }}
          onMore={() => {
            setMaxResults(maxResults + LOCATIONS_CHUNK_SIZE);
          }}
        />

        <div className={styles.price}>
          <span className={styles.productsPrice}>$2300</span>
          <span className={styles.installationPrice}>
            <span> + </span>
            <span> $500 </span>
            <span> for installation </span>
          </span>
        </div>
        <div className={styles.buttonWrapper}>
          <Button className={styles.submitButton} size="large" disabled>
            Make an enquiry
          </Button>
        </div>
      </form>
    </section>
  );
}
