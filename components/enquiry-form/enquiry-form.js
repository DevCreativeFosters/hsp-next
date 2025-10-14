'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import { useCart } from '@contexts/cart-context';
import StoreLocatorContext from '@contexts/store-locator';

import useMobileVh from '@hooks/useMobileVh';

import { formatPrice, getProductImage } from '@lib/helpers';
import normalizeStores from '@lib/normalize-stores';
import { trimSlash } from '@lib/trim-slash';

import Button from '@components/button/button';
import Select from '@components/form/select';

import styles from './enquiry-form.module.scss';
import EnquiryModal from './enquiry-modal';

export default function EnquiryForm({
  allLocations,
  enquiryFormId,
  mainCategory,
  onVariantChange: onVariantChangeCallback = slug => {},
  productData,
  variantSlug,
}) {
  const [_, setIsFormValid] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);
  const isOutOfStock =
    productData.stockStatus === 'OUT_OF_STOCK' ||
    productData.stockQuantity <= 0;

  const [normalizedLocations, setNormalizedLocations] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

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

  const mainCategoryId = mainCategory?.databaseId;

  if (selectedVariant) {
    if (mainCategoryId) {
      productData?.productCategories?.nodes?.forEach(category => {
        if (category.databaseId === mainCategoryId) {
          selectedVariant.icon =
            category.categoryRelations?.icon?.node?.sourceUrl || null;
        }
      });
    }

    selectedVariant.productName = productData.title;
    selectedVariant.image = getProductImage(selectedVariant, productData);
  }

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

  const { location, searchGeolocation, selectedStore, setShowLocationError } =
    useContext(StoreLocatorContext);

  useEffect(
    function normalizeStoreLocations() {
      const normalized = normalizeStores(allLocations);
      setNormalizedLocations(normalized);
    },
    [allLocations],
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

  const handleButtonWrapperClick = () => {
    if (!selectedStore) {
      setShowLocationError(true);
    }
  };

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

  const handleInputChange = event => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      setQuantity(newValue);
    }
  };

  return (
    <>
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
            labelMarginBottom="20px"
            marginTop="16px"
            onChange={onVariantChange}
            options={variantOptions}
            placeholder="Variant"
            size="large"
            value={
              selectedVariant?.variantSlug ||
              (variantOptions?.length ? variantOptions?.value : '')
            }
          />

          <div className={styles.price}>
            {variantPrice > 0 && (
              <span className={clsx(styles.productsPrice, 'h3')}>
                {formatPrice(variantPrice)}
              </span>
            )}
            {variantInstallationPrice > 0 && (
              <span className={clsx(styles.installationPrice, 'h4')}>
                +<span> {formatPrice(variantInstallationPrice)} </span>
                <span> for installation </span>
              </span>
            )}
          </div>
          <div className={styles.stockStatus}>
            <div className={styles.qtyBlock}>
              <button
                className={styles.minus}
                disabled={isOutOfStock}
                onClick={() => setQuantity(prevQuantity => prevQuantity - 1)}
                type="button"
              >
                _
              </button>
              <input
                min="1"
                onChange={handleInputChange}
                type="number"
                value={quantity}
              />
              <button
                className={styles.plus}
                disabled={isOutOfStock}
                onClick={() => setQuantity(prevQuantity => prevQuantity + 1)}
                type="button"
              >
                +
              </button>
            </div>
            {!isOutOfStock && (
              <div className={styles.statusInstock}>In Stock</div>
            )}
            {isOutOfStock && (
              <div className={styles.statusOutOfstock}>Out of Stock</div>
            )}
          </div>
          <div
            className={styles.buttonWrapper}
            onClick={handleButtonWrapperClick}
          >
            <Button
              className={styles.submitButton}
              disabled={isOutOfStock}
              onClick={() => addToCart(productData.databaseId, quantity)}
              size="large"
            >
              Add to Cart
            </Button>
            <Button
              className={styles.submitButton}
              onClick={handleOpenModal}
              size="large"
            >
              Make an enquiry
            </Button>
          </div>
        </form>
        {enquiryModalOpened && (
          <EnquiryModal
            allLocations={allLocations}
            enquiryFormId={enquiryFormId}
            freight={freight}
            installationCost={variantInstallationPrice}
            onClose={handleCloseModal}
            productPrice={variantPrice ?? productPrice}
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
    </>
  );
}
