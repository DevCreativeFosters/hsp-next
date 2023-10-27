'use client';

import { findLocationsInRadius } from '@lib/store-locations';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import { STORE_LOCATOR_FULLSCREEN } from '@lib/class-names';
import useMobileVh from '@hooks/useMobileVh';
import { useIsMobile } from '@hooks/useIsMobile';
import StoreLocatorContext, { RADIUS_OPTIONS } from '@contexts/store-locator';
import Select from '@components/form/select';
import Button from '@components/button/button';
import StoreList from '@components/store-list/store-list';
import Input from './input';
import Suggestions from './suggestions';
import ResultItem from './result-item';
import ArrowForwardIcon from '@assets/material-icons/arrow-forward.svg';

import styles from './search.module.scss';

function stringifySuggestion(suggestion) {
  return suggestion.structured_formatting?.main_text;
}

const FETCH_CONFIG = {
  method: 'GET',
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json' },
};

export default function Search() {
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState(undefined);
  const [filteredLocations, setFilteredLocations] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [viewMode, setViewMode] = useState('LIST'); // 'LIST' | 'RESULT'
  const wrapperOuterRef = useRef(null);
  const isMobile = useIsMobile();
  const formRef = useRef(null);

  useMobileVh();

  const { searchGeolocation, setSearchGeolocation, radius, setRadius } =
    useContext(StoreLocatorContext);

  const onFormInteraction = useCallback(
    ev => {
      if (isMobile) {
        setIsFullScreen(true);
      }
    },
    [isMobile],
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

  const goBack = useCallback(() => {
    if (viewMode === 'RESULT') {
      setViewMode('LIST');
    } else if (isFullScreen) {
      setIsFullScreen(false);
    }
  }, [viewMode, isFullScreen]);

  const isInlineResultListVisible = Boolean(
    location && searchGeolocation && radius && isFullScreen,
  );

  useEffect(
    function toggleSuggestions() {
      let isMounted = true;
      if (locationInput) {
        if (!location || stringifySuggestion(location) !== locationInput) {
          const fetchSuggestions = async () => {
            const predictions = await getSuggestions(locationInput);
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
    [locationInput, location, getSuggestions],
  );

  useEffect(
    function syncDocumentClass() {
      if (isFullScreen) {
        document.documentElement.classList.add(STORE_LOCATOR_FULLSCREEN);
      } else {
        document.documentElement.classList.remove(STORE_LOCATOR_FULLSCREEN);
      }

      return () => {
        document.documentElement.classList.remove(STORE_LOCATOR_FULLSCREEN);
      };
    },
    [isFullScreen],
  );

  useEffect(
    function syncStoreLocationResultList() {
      if (searchGeolocation && radius) {
        setFilteredLocations(findLocationsInRadius(searchGeolocation, radius));
      }
      return () => {};
    },
    [searchGeolocation, radius],
  );

  return (
    <section
      className={clsx(styles.wrapper, {
        [styles.isFullScreen]: isFullScreen,
      })}
      ref={wrapperOuterRef}
    >
      <header className={styles.header}>
        <button
          className={clsx(styles.goBack, {
            [styles.isVisible]: isFullScreen,
          })}
          onClick={goBack}
        >
          <ArrowForwardIcon />
        </button>

        <h3 className={styles.heading}>[ Locate a store ]</h3>
      </header>

      <div
        className={clsx(styles.viewContainer, {
          [styles.listMode]: viewMode === 'LIST',
          [styles.resultMode]: viewMode === 'RESULT',
        })}
      >
        <div className={styles.viewContent}>
          <form
            action="#"
            className={styles.form}
            onChange={onAnyInputChange}
            ref={formRef}
            autoComplete="off"
          >
            <div className={styles.searchPhraseWrapper}>
              <Input
                type="text"
                name="location"
                placeholder="[ Search location ]"
                icon="search"
                withResetButton
                value={locationInput}
                onClick={onFormInteraction}
                onChange={value => {
                  setLocationInput(value);
                  if (!value) {
                    setLocation(null);
                    setSearchGeolocation(null);
                  }
                }}
                required
              />

              <Suggestions
                items={suggestions}
                selectLocation={selectLocation}
              />
            </div>

            <Select
              className={styles.radius}
              size="large"
              placeholder="[ Select radius ]"
              background="dark"
              suffix="km"
              onClick={onFormInteraction}
              onChange={onRadiusChange}
              options={RADIUS_OPTIONS}
              selected={radius}
            />

            <div className={styles.mobileOnly}>
              <StoreList
                items={filteredLocations}
                show={isInlineResultListVisible}
                onSelect={item => {
                  setCurrentResult(item);
                  setViewMode('RESULT');
                }}
              />
            </div>

            {!isInlineResultListVisible && (
              <Button
                type="button"
                className={styles.button}
                rightIcon="search"
                href="#store-search"
                onClick={() => {
                  if (!isFullScreen) {
                    setIsFullScreen(true);
                  } else {
                    formRef.current.reportValidity();
                  }
                }}
              >
                [Search]
              </Button>
            )}
          </form>
        </div>

        <div className={styles.viewContent}>
          <div className={styles.singleResult}>
            {currentResult && <ResultItem item={currentResult} />}
            <div className={styles.buttonWrapper}>
              <Button
                variant="quaternary"
                onClick={goBack}
                leftIcon="arrow-backward"
              >
                [ Back to search ]
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
