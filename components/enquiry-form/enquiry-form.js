'use client';

import {
  useCallback,
  useMemo,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
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
import styles from './enquiry-form.module.scss';

export default function EnquiryForm({
  enquiryFormId,
  productData,
  onVariantChange: onVariantChangeCallback = () => {},
}) {
  const [_, setIsFormValid] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const highlightHandler = useRef(null);
  const wrapperOuterRef = useRef(null);
  const formRef = useRef(null);
  const productFields = productData.productFields;
  const productPrice = productFields?.price;
  const variants = productFields?.variants;
  const variantOptions = variants?.map(({ variantName, variantSlug }) => ({
    label: variantName,
    value: variantSlug,
  }));

  const {
    location,
    searchGeolocation,
    filteredLocations,
    selectedStore,
    setSelectedStore,
    radius,
    isMapVisible,
  } = useContext(StoreLocatorContext);

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

  const onVariantChange = useCallback(
    value => {
      const newSelectedVariant = variants.find(
        variant => variant.variantSlug === value,
      );

      setSelectedVariant([newSelectedVariant]);
      onVariantChangeCallback(newSelectedVariant);
    },
    [variants],
  );

  const handleOpenModal = () => {
    setEnquiryModalOpened(true);
  };

  const handleCloseModal = () => {
    setEnquiryModalOpened(false);
  };

  const isInlineResultListVisible = Boolean(
    location && searchGeolocation && radius,
  );

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
            selectedVariant?.[0]?.variantSlug ||
            (variantOptions?.length ? variantOptions[0]?.value : '')
          }
        />

        <StoreSearchControls
          isWide
          interactWithDisabledForm={interactWithDisabledForm}
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
              items={filteredLocations}
              show={isInlineResultListVisible}
              onSelect={item => {
                setSelectedStore(item);
              }}
            />
          </>
        )}

        <div className={styles.price}>
          {productPrice > 0 && (
            <span className={styles.productsPrice}>
              {formatPrice(productPrice)}
            </span>
          )}
          {selectedStore && installationCost > 0 && (
            <span>
              <span> + </span>
              <span> {formatPrice(installationCost)} </span>
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
            selectedVariant || (variants?.length ? [variants[0]] : []) // TODO: Refactor selectedProducts prop while working on UTE Builder form
          }
          productPrice={productPrice}
          installationCost={installationCost}
        />
      )}
    </section>
  );
}
