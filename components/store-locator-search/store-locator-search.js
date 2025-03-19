'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';

import StoreLocatorContext from '@contexts/store-locator';

import { useIsMobile } from '@hooks/useIsMobile';
import useMobileVh from '@hooks/useMobileVh';

import { STORE_LOCATOR_FULLSCREEN } from '@lib/class-names';
import {
  getPlaceDetails,
  getPlaceSuggestions,
  stringifySuggestion,
} from '@lib/google-place';
import normalizeStores from '@lib/normalize-stores';
import { getLocationsToDisplay } from '@lib/store-locations';

import Button from '@components/button/button';
import Container from '@components/container/container';
import StoreLocatorInput from '@components/store-locator-input/store-locator-input';
import StoreLocatorSuggestions from '@components/store-locator-suggestions/store-locator-suggestions';
import StoreTilesList from '@components/store-tiles-list/store-tiles-list';

import styles from './store-locator-search.module.scss';

export default function StoreLocatorSearch({ allLocations }) {
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState(undefined);
  const [currentResult, setCurrentResult] = useState(null);
  const wrapperOuterRef = useRef(null);
  const isMobile = useIsMobile();
  const formRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  });

  useMobileVh();

  const {
    filteredLocations,
    isInlineResultListVisible,
    searchGeolocation,
    setAllMapLocations,
    setFilteredLocations,
    setInlineResultListVisible,
    setSearchGeolocation,
  } = useContext(StoreLocatorContext);

  const onFormInteraction = useCallback(
    ev => {
      if (isMobile) {
        setIsFullScreen(true);
      }
    },
    [isMobile],
  );

  const onAnyInputChange = useCallback(
    ev => {
      setIsFormValid(
        formRef.current?.checkValidity() && location !== undefined,
      );
    },
    [location],
  );

  const selectLocation = useCallback(
    async suggestion => {
      setLocation(suggestion);
      setLocationInput(suggestion.description);
      const placeId = suggestion.place_id;
      setSuggestions([]);
      const placeDetails = await getPlaceDetails(placeId, sessionToken);
      const geolocation = placeDetails?.result?.geometry?.location;
      setSessionToken(uuidv4());
      setSearchGeolocation(geolocation);
      setIsFormValid(true);

      // For mobile, automatically go to fullscreen mode when location is selected
      if (isMobile) {
        setIsFullScreen(true);
      }
    },
    [isMobile, sessionToken, setIsFullScreen, setSearchGeolocation],
  );

  const goBack = useCallback(() => {
    if (isFullScreen) {
      setIsFullScreen(false);
      setLocationInput('');
      setLocation(null);
      setSearchGeolocation(null);
      setSuggestions([]);
    }
  }, [
    isFullScreen,
    setLocation,
    setLocationInput,
    setSearchGeolocation,
    setSuggestions,
  ]);

  useEffect(() => {
    setInlineResultListVisible(
      Boolean(location && searchGeolocation && isFullScreen && isMobile),
    );

    if (!isMobile && isFullScreen) {
      setIsFullScreen(false);
    }
  }, [
    isFullScreen,
    isMobile,
    location,
    searchGeolocation,
    setInlineResultListVisible,
  ]);

  const isSearchButtonVisible = !isInlineResultListVisible && !isFullScreen;

  useEffect(
    function toggleSuggestions() {
      let isMounted = true;
      if (locationInput) {
        if (!location || stringifySuggestion(location) !== locationInput) {
          setIsFormValid(false);
          const fetchSuggestions = async () => {
            const predictions = await getPlaceSuggestions(
              locationInput,
              sessionToken,
            );
            if (isMounted) {
              setSuggestions(predictions);
            }
          };
          fetchSuggestions().catch(console.error);
        }
      } else {
        setSuggestions([]);
        setIsFormValid(false);
      }

      return () => {
        isMounted = false;
      };
    },
    [location, locationInput, sessionToken],
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

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(
    function attachIntersectionObserver() {
      const { height, width } = windowSize;
      const el = wrapperOuterRef.current;
      let io;
      if (width && height && el) {
        const headerHeight =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--header-height',
            ),
          ) || 0;
        const top = headerHeight;
        const bottom = height - top;
        const rootMargin = `-${top - 1}px 0px -${bottom}px 0px`;
        io = new IntersectionObserver(
          function (entries) {
            const entry = entries[0];
            const { isIntersecting } = entry;

            el.classList.toggle(styles.isCloseToHeader, isIntersecting);
          },
          {
            root: document.body,
            rootMargin,
            threshold: 0,
          },
        );
        io.observe(el);
      }

      return () => {
        if (io) {
          io.disconnect();
        }
      };
    },
    [windowSize.height, windowSize.width], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <section
      className={clsx(styles.wrapper, {
        [styles.isFullScreen]: isFullScreen,
        [styles.showingResults]: isInlineResultListVisible,
      })}
      ref={wrapperOuterRef}
    >
      <Container>
        <div className={styles.viewContainer}>
          {isFullScreen && (
            <Button
              className={styles.goBackButton}
              leftIcon="arrow-backward"
              onClick={goBack}
              variant="quinary"
            >
              Back to search
            </Button>
          )}

          <div className={styles.viewContent}>
            {!isFullScreen && (
              <span className={clsx(styles.label, 'h4')}>Locate a store</span>
            )}
            <form
              action="#"
              autoComplete="off"
              className={styles.form}
              onChange={onAnyInputChange}
              ref={formRef}
            >
              <div className={styles.searchPhraseWrapper}>
                <StoreLocatorInput
                  icon="search"
                  name="location"
                  onChange={value => {
                    setLocationInput(value);
                    if (!value) {
                      setLocation(null);
                      setSearchGeolocation(null);
                    }
                  }}
                  onClick={onFormInteraction}
                  placeholder="Your location"
                  required
                  type="text"
                  value={locationInput}
                  withResetButton
                />

                <StoreLocatorSuggestions
                  items={suggestions}
                  selectLocation={selectLocation}
                />
              </div>

              {isInlineResultListVisible && (
                <div className={clsx(styles.mobileOnly, styles.storeList)}>
                  <StoreTilesList
                    allLocations={allLocations}
                    filteredStores={filteredLocations}
                    normalizeStores={normalizeStores}
                    selectedStore={currentResult}
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
