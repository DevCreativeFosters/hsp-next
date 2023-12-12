'use client';

import {
  useCallback,
  useMemo,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import StoreLocatorContext, {
  DEFAULT_RADIUS,
  RADIUS_OPTIONS,
} from '@contexts/store-locator';
import useMobileVh from '@hooks/useMobileVh';
import { findLocationsInRadius } from '@lib/store-locations';
import {
  getPlaceSuggestions,
  getPlaceGeoLocation,
  stringifySuggestion,
} from '@lib/google-place';
import { allLocations } from '@mockup/store-locations';
import StoreLocatorInput from '@components/store-locator-input/store-locator-input';
import StoreLocatorSuggestions from '@components/store-locator-suggestions/store-locator-suggestions';
import Select from '@components/form/select';
import Switch from '@components/form/switch';
import StoreList from '@components/store-list/store-list';
import StoreTile from '@components/store-tile/store-tile';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import Button from '@components/button/button';
import EnquiryModal from './enquiry-modal';
import styles from './enquiry-form.module.scss';

export default function EnquiryForm({ productData }) {
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [_, setIsFormValid] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [location, setLocation] = useState(undefined);
  const [filteredLocations, setFilteredLocations] = useState(allLocations);
  const [isMapVisible, setMapVisible] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('');
  const highlightHandler = useRef(null);
  const wrapperOuterRef = useRef(null);
  const formRef = useRef(null);
  const productFields = productData.productFields;
  const productPrice = productFields?.price;
  const variants = productFields?.variants;
  const variantOptions = variants.map(({ variantName, variantSlug }) => ({
    label: variantName,
    value: variantSlug,
  }));
  const installationCost = useMemo(() => {
    let storeCost;
    const storeInstallationCost = selectedStore?.productInstallationCost;

    if (selectedStore && storeInstallationCost?.length) {
      storeInstallationCost.map(item => {
        if (item.product.slug === productData.slug) {
          storeCost = item.installation_cost;
        }
      });
    }

    return storeCost || productFields.installationCost;
  }, [selectedStore, productData.slug, productFields.installationCost]);

  useMobileVh();

  const onVariantChange = useCallback((value, label) => {
    setSelectedVariant({ value, label });
  }, []);

  const handleOpenModal = () => {
    setEnquiryModalOpened(true);
  };

  const handleCloseModal = () => {
    setEnquiryModalOpened(false);
  };

  const { searchGeolocation, setSearchGeolocation, radius, setRadius } =
    useContext(StoreLocatorContext);

  const isInlineResultListVisible = Boolean(
    location && searchGeolocation && radius,
  );

  const onAnyInputChange = useCallback(ev => {
    setIsFormValid(formRef.current?.checkValidity());
  }, []);

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

  const onClear = useCallback(() => {
    setLocation(null);
    setLocationInput('');
    setSearchGeolocation(null);
    setFilteredLocations(allLocations);
    setSelectedStore(null);
    setRadius(DEFAULT_RADIUS);
  }, [setSearchGeolocation, setRadius]);

  const interactWithDisabledForm = useCallback(() => {
    if (selectedStore) {
      setHighlight(Math.random());
    }
  }, [selectedStore]);

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
    [searchGeolocation, radius],
  );

  useEffect(
    function resetHighlight() {
      if (highlight) {
        clearTimeout(highlightHandler.current);
        highlightHandler.current = setTimeout(() => {
          setHighlight(false);
        }, 400);
      }
      return () => {
        clearTimeout(highlightHandler.current);
      };
    },
    [highlight],
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
          id="product-variant"
          size="large"
          placeholder="Variant"
          label="Variant"
          onChange={onVariantChange}
          options={variantOptions}
          value={
            selectedVariant?.value ||
            (variantOptions.length ? variantOptions[0].value : '')
          }
        />

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

        {selectedStore ? (
          <div className={styles.resultUI}>
            <div className={styles.resultContainer}>
              <StoreTile item={selectedStore} />
            </div>
            <button
              type="button"
              className={clsx(styles.resultClearButton, {
                [styles.isHighlighted]: highlight,
              })}
              onClick={onClear}
            >
              <span />
            </button>
          </div>
        ) : (
          <>
            {isMapVisible && (
              <StoreLocatorMap
                locations={filteredLocations}
                onMarkerClick={setSelectedStore}
              />
            )}

            <StoreList
              className={styles.results}
              items={filteredLocations}
              show={true}
              onSelect={item => {
                setSelectedStore(item);
              }}
            />
          </>
        )}

        <div className={styles.price}>
          {productPrice > 0 && (
            <span className={styles.productsPrice}>${productPrice}</span>
          )}
          {selectedStore && installationCost > 0 && (
            <span className={styles.installationCost}>
              <span> + </span>
              <span> ${installationCost} </span>
              <span> for installation </span>
            </span>
          )}
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            className={styles.submitButton}
            size="large"
            disabled={!selectedStore}
            onClick={handleOpenModal}
          >
            Make an enquiry
          </Button>
        </div>
      </form>
      {enquiryModalOpened && (
        <EnquiryModal
          onClose={handleCloseModal}
          store={selectedStore}
          selectedVariant={
            selectedVariant || (variantOptions.length ? variantOptions[0] : '')
          }
          productPrice={productPrice}
          installationCost={installationCost}
        />
      )}
    </section>
  );
}
