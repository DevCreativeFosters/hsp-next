'use client';

import { trimSlash } from '@lib/trim-slash';
import { useCallback, useContext, useEffect, useState, useRef } from 'react';
import useMobileVh from '@hooks/useMobileVh';
import StoreSearchControls from '@components/store-search-controls/store-search-controls';
import StoreLocatorContext from '@contexts/store-locator';
import Select from '@components/form/select';
import StoreList from '@components/store-list/store-list';
import ResultsStoreTile from '@components/store-tile/result-store-tile';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import Button from '@components/button/button';
import EnquiryModal from './enquiry-modal';
import { formatPrice } from '@lib/helpers';
import { findLocationsInRadius } from '@lib/store-locations';
import styles from './enquiry-form.module.scss';

export default function EnquiryForm({
  enquiryFormId,
  productData,
  allLocations,
  variantSlug,
  onVariantChange: onVariantChangeCallback = slug => {},
}) {
  const [_, setIsFormValid] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);
  const [showMoreResults, setShowMoreResults] = useState(false);
  const highlightHandler = useRef(null);
  const wrapperOuterRef = useRef(null);
  const formRef = useRef(null);
  const productFields = productData.productFields;
  const productPrice = productFields?.price;
  const productInstallationPrice = productFields?.installationCost;
  const variants = productFields?.variants;
  const variantOptions = variants?.map(({ variantName, variantSlug }) => ({
    label: variantName,
    value: variantSlug,
  }));

  const selectedVariant =
    variants?.find(
      ({ variantSlug: slug }) => trimSlash(slug) === variantSlug,
    ) || variants?.[0];

  const variantPrice = selectedVariant?.variantDetails?.price
    ? selectedVariant?.variantDetails.price
    : selectedVariant?.parentInherit
      ? productPrice
      : null;

  const variantInstallationPrice = selectedVariant?.variantDetails
    ?.installationCost
    ? selectedVariant?.variantDetails.installationCost
    : selectedVariant?.parentInherit
      ? productInstallationPrice
      : null;

  console.log(selectedVariant);

  const {
    location,
    searchGeolocation,
    filteredLocations,
    filteredStores,
    setFilteredStores,
    selectedStore,
    setSelectedStore,
    isMapVisible,
  } = useContext(StoreLocatorContext);

  useEffect(
    function syncLocationsBasedOnInitialSearch() {
      if (searchGeolocation) {
        setFilteredStores(
          findLocationsInRadius(searchGeolocation, filteredLocations),
        );
      }
    },
    [searchGeolocation, filteredLocations, setFilteredStores],
  );

  useMobileVh();

  const onVariantChange = useCallback(
    value => {
      const newSelectedVariant = variants.find(
        variant => variant.variantSlug === value,
      );
      const variantSlug = newSelectedVariant?.variantSlug;
      if (variantSlug) {
        onVariantChangeCallback(trimSlash(variantSlug));
      }
    },
    [variants, onVariantChangeCallback],
  );

  const handleOpenModal = () => {
    setEnquiryModalOpened(true);
  };

  const handleCloseModal = () => {
    setEnquiryModalOpened(false);
  };

  const isInlineResultListVisible = Boolean(location && searchGeolocation);

  const onAnyInputChange = useCallback(ev => {
    setIsFormValid(formRef.current?.checkValidity());
  }, []);

  const interactWithDisabledForm = useCallback(() => {
    if (selectedStore) {
      setHighlight(Math.random());
    }
  }, [selectedStore]);

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
            selectedVariant?.variantSlug ||
            (variantOptions?.length ? variantOptions?.value : '')
          }
        />

        <StoreSearchControls
          isWide
          interactWithDisabledForm={interactWithDisabledForm}
          allLocations={allLocations}
        />

        {selectedStore ? (
          <ResultsStoreTile item={selectedStore} isHighlighted={highlight} />
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
              items={filteredStores}
              show={isInlineResultListVisible}
              showMoreResults={showMoreResults}
              onSelect={item => {
                setSelectedStore(item);
              }}
            />
            {!showMoreResults &&
              isInlineResultListVisible &&
              filteredStores.length > 5 && (
                <div className={styles.showMoreWrapper}>
                  <Button
                    size="small"
                    variant="septenary"
                    onClick={() => setShowMoreResults(true)}
                    className={styles.showMoreButton}
                  >
                    Load more results
                  </Button>
                </div>
              )}
          </>
        )}

        <div className={styles.price}>
          {variantPrice > 0 && (
            <span className={styles.productsPrice}>
              {formatPrice(variantPrice)}
            </span>
          )}
          {variantInstallationPrice > 0 && (
            <span className={styles.installationPrice}>
              +<span> {formatPrice(variantInstallationPrice)} </span>
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
          enquiryFormId={enquiryFormId}
          onClose={handleCloseModal}
          store={selectedStore}
          selectedProducts={
            selectedVariant
              ? [selectedVariant]
              : variants?.length
                ? [variants[0]]
                : [] // TODO: Refactor selectedProducts prop while working on UTE Builder form
          }
          productPrice={productPrice}
          installationCost={variantInstallationPrice}
        />
      )}
    </section>
  );
}
