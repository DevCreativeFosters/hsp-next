'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import StoreLocatorContext from '@contexts/store-locator';

import useMobileVh from '@hooks/useMobileVh';

import { formatPrice, getProductImage } from '@lib/helpers';
import { findLocationsInRadius } from '@lib/store-locations';
import { trimSlash } from '@lib/trim-slash';

import Button from '@components/button/button';
import Select from '@components/form/select';
import StoreList from '@components/store-list/store-list';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import StoreSearchControls from '@components/store-search-controls/store-search-controls';
import ResultsStoreTile from '@components/store-tile/result-store-tile';

import styles from './enquiry-form.module.scss';
import EnquiryModal from './enquiry-modal';

export default function EnquiryForm({
  allLocations,
  enquiryFormId,
  onVariantChange: onVariantChangeCallback = slug => {},
  productData,
  variantSlug,
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
  const freight = productFields?.freight;
  const variants = productFields?.variants;
  const variantOptions = variants?.map(({ variantName, variantSlug }) => ({
    label: variantName,
    value: variantSlug,
  }));

  const selectedVariant =
    variants?.find(
      ({ variantSlug: slug }) => trimSlash(slug) === variantSlug,
    ) || variants?.[0];

  selectedVariant.productName = productData.title;
  selectedVariant.image = getProductImage(selectedVariant, productData);

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

  const {
    filteredLocations,
    filteredStores,
    isMapVisible,
    location,
    searchGeolocation,
    selectedStore,
    setFilteredStores,
    setSelectedStore,
  } = useContext(StoreLocatorContext);

  useEffect(
    function syncLocationsBasedOnInitialSearch() {
      if (searchGeolocation) {
        setFilteredStores(
          findLocationsInRadius(searchGeolocation, filteredLocations),
        );
      }
    },
    [filteredLocations, searchGeolocation, setFilteredStores],
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
    [onVariantChangeCallback, variants],
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
        autoComplete="off"
        className={styles.form}
        onChange={onAnyInputChange}
        ref={formRef}
      >
        <Select
          id="product-variant"
          label="Variant"
          onChange={onVariantChange}
          options={variantOptions}
          placeholder="Variant"
          size="large"
          value={
            selectedVariant?.variantSlug ||
            (variantOptions?.length ? variantOptions?.value : '')
          }
        />

        <StoreSearchControls
          allLocations={allLocations}
          interactWithDisabledForm={interactWithDisabledForm}
          isWide
        />

        {selectedStore ? (
          <ResultsStoreTile isHighlighted={highlight} item={selectedStore} />
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
              onSelect={item => {
                setSelectedStore(item);
              }}
              show={isInlineResultListVisible}
              showMoreResults={showMoreResults}
            />
            {!showMoreResults &&
              isInlineResultListVisible &&
              filteredStores.length > 5 && (
                <div className={styles.showMoreWrapper}>
                  <Button
                    className={styles.showMoreButton}
                    onClick={() => setShowMoreResults(true)}
                    size="small"
                    variant="septenary"
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
            disabled={!selectedStore}
            onClick={handleOpenModal}
            size="large"
          >
            Make an enquiry
          </Button>
        </div>
      </form>
      {enquiryModalOpened && (
        <EnquiryModal
          enquiryFormId={enquiryFormId}
          freight={freight}
          installationCost={variantInstallationPrice}
          onClose={handleCloseModal}
          productPrice={productPrice ?? variantPrice}
          selectedProducts={
            selectedVariant
              ? [selectedVariant]
              : variants?.length
                ? [variants[0]]
                : [] // TODO: Refactor selectedProducts prop while working on UTE Builder form
          }
          store={selectedStore}
        />
      )}
    </section>
  );
}
