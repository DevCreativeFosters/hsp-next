'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import { STORE_LOCATOR_FULLSCREEN } from '@lib/class-names';
import useMobileVh from '@hooks/useMobileVh';
import { useIsMobile } from '@hooks/useIsMobile';
import StoreLocatorContext, { RADIUS_OPTIONS } from '@contexts/store-locator';
import Select from '@components/form/select';
import Button from '@components/button/button';
import Input from '@components/store-locator-search/input';
import Container from '@components/container/container';
import ArrowForwardIcon from '@assets/material-icons/arrow-forward.svg';

import styles from './store-locator-search.module.scss';

const MAX_SUGGESTIONS = 5;

function stringifySuggestion(suggestion) {
  return suggestion.structured_formatting?.main_text;
}

const FETCH_CONFIG = {
  method: 'GET',
  credentials: 'same-origin',
  headers: { 'Content-Type': 'application/json' },
};

export default function StoreLocatorSearch() {
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState(undefined);
  const wrapperOuterRef = useRef(null);
  const isMobile = useIsMobile();
  const formRef = useRef(null);

  useMobileVh();

  const { setSearchGeolocation, radius, setRadius } =
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
          onClick={() => setIsFullScreen(false)}
        >
          <ArrowForwardIcon />
        </button>

        <h3 className={styles.heading}>ILocate a store</h3>
      </header>
      <Container>
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
              placeholder="ISearch location"
              icon="search"
              value={locationInput}
              onClick={onFormInteraction}
              onChange={ev => setLocationInput(ev.target.value)}
              required
            />
            {suggestions.length > 0 && (
              <div className={styles.suggestions}>
                <ul className={styles.suggestionList}>
                  {suggestions
                    .slice(0, MAX_SUGGESTIONS)
                    .map((suggestion, index) => {
                      const primaryText =
                        suggestion.structured_formatting?.main_text;
                      const secondaryText =
                        suggestion.structured_formatting?.secondary_text;
                      return (
                        <li
                          className={styles.suggestion}
                          key={index}
                          onClick={() => selectLocation(suggestion)}
                        >
                          {primaryText && (
                            <div className={styles.line1}>{primaryText}</div>
                          )}
                          {secondaryText && (
                            <div className={styles.line2}>{secondaryText}</div>
                          )}
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
          </div>
          <Select
            className={styles.radius}
            size="large"
            placeholder="Select radius"
            background="dark"
            suffix="km"
            onClick={onFormInteraction}
            onChange={onRadiusChange}
            options={RADIUS_OPTIONS}
            selected={radius}
          />
          <Button
            className={styles.button}
            rightIcon="search"
            disabled={!isFormValid}
            href="#store-search"
          >
            ISearch
          </Button>
        </form>
      </Container>
    </section>
  );
}
