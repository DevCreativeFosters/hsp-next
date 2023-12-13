'use client';

import {
  useCallback,
  useMemo,
  useContext,
  useEffect,
  useRef,
  useState,
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

export default function EnquiryForm({ productData }) {
  const productFields = productData.productFields;
  const variants = productFields?.variants.map(productVariant => ({
    ...productVariant,
    price:
      productVariant.variantDetails.price ||
      (productVariant.parentInherit && productFields.price),
  }));
  const [_, setIsFormValid] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const highlightHandler = useRef(null);
  const wrapperOuterRef = useRef(null);
  const formRef = useRef(null);
  const variantOptions = variants.map(({ variantName, variantSlug }) => ({
    label: variantName,
    value: variantSlug,
  }));

  const {
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

      console.log('NEW', newSelectedVariant);

      setSelectedVariant(newSelectedVariant);
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
          value={selectedVariant?.variantSlug}
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
          {selectedVariant.price > 0 && (
            <span className={styles.productsPrice}>
              {formatPrice(selectedVariant.price)}
            </span>
          )}
          {selectedStore && installationCost > 0 && (
            <span className={styles.installationCost}>
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
          onClose={handleCloseModal}
          store={selectedStore}
          selectedProducts={[
            { ...selectedVariant, installationCost: installationCost },
          ]}
          productPrice={selectedVariant.price}
          installationCost={installationCost}
        />
      )}
    </section>
  );
}
