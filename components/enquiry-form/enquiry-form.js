'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

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

  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [isCartWrapperVisible, setIsCartWrapperVisible] = useState(false); // New state

  const [normalizedLocations, setNormalizedLocations] = useState([]);

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

  const {
    filteredLocations,
    filteredStores,
    hasMapInteracted,
    isMapVisible,
    location,
    searchGeolocation,
    selectedStore,
    setFilteredStores,
    setSelectedStore,
    setShowLocationError,
  } = useContext(StoreLocatorContext);

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

  const closeCart = () => {
    setIsCartWrapperVisible(false);
    setTimeout(() => {
      setIsCartPopupOpen(false);
    }, 400);
  };

  const openCart = () => {
    setIsCartPopupOpen(true);
    setTimeout(() => {
      setIsCartWrapperVisible(true);
    }, 10);
  };

  const handleCartToggle = () => {
    if (isCartPopupOpen) {
      closeCart();
    } else {
      openCart();
    }
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

  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleInputChange = event => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      setQuantity(newValue);
    }
  };

  return (
    <>
      {isCartPopupOpen && (
        <div className={styles.cartMain} onClick={handleCartToggle}>
          <div
            className={`${styles.cartWrapper} ${isCartWrapperVisible ? styles.slideIn : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <h2>Shopping Cart:</h2>

            {/* Cart Item */}

            <div className={styles.cartItem}>
              <div className={styles.listImg}>
                <img src="https://wordpress-1505184-5847603.cloudwaysapps.com/wp-content/uploads/2025/08/Volkswagon-Amarok-Gif.gif" />
              </div>

              <div className={styles.itemInfo}>
                <h6>
                  Electric Roller Cover for Next Gen Ranger Raptor for No Sports
                  bar
                </h6>
                <div className={styles.itemPrice}>
                  $3,300 <del>3300</del>
                </div>
                <div className={styles.itemBottom}>
                  <div className={styles.qtyBlock}>
                    <span className={styles.minus} onClick={handleDecrement}>
                      _
                    </span>
                    <input
                      min="0"
                      onChange={handleInputChange}
                      type="number"
                      value={quantity}
                    />
                    <span className={styles.plus} onClick={handleIncrement}>
                      +
                    </span>
                  </div>
                  <a className={styles.removeLink} href="#">
                    Remove
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.cartItem}>
              <div className={styles.listImg}>
                <img src="https://wordpress-1505184-5847603.cloudwaysapps.com/wp-content/uploads/2025/08/Volkswagon-Amarok-Gif.gif" />
              </div>

              <div className={styles.itemInfo}>
                <h6>
                  Electric Roller Cover for Next Gen Ranger Raptor for No Sports
                  bar
                </h6>
                <div className={styles.itemPrice}>
                  $3,300 <del>3300</del>
                </div>
                <div className={styles.itemBottom}>
                  <div className={styles.qtyBlock}>
                    <span className={styles.minus} onClick={handleDecrement}>
                      _
                    </span>
                    <input
                      min="0"
                      onChange={handleInputChange}
                      type="number"
                      value={quantity}
                    />
                    <span className={styles.plus} onClick={handleIncrement}>
                      +
                    </span>
                  </div>
                  <a className={styles.removeLink} href="#">
                    Remove
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.cartTotal}>Subtotal: $3,300</div>

            <Button className={styles.cartSubmitButton} size="large">
              Check Out
              <svg
                fill="none"
                height="34"
                width="34"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M33.031 15.031v3.938H8.656l11.157 11.25L17 33.03.969 17 17 .969l2.813 2.812-11.157 11.25z"
                  fill="#fff"
                ></path>
              </svg>
            </Button>
            <Button
              className={styles.dismissButton}
              onClick={handleCartToggle}
              size="large"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

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
              <span className={styles.minus} onClick={handleDecrement}>
                _
              </span>
              <input
                min="0"
                onChange={handleInputChange}
                type="number"
                value={quantity}
              />
              <span className={styles.plus} onClick={handleIncrement}>
                +
              </span>
            </div>
            <div className={styles.statusInstock}>In Stock</div>
            <div className={styles.statusOutOfstock}>Out of Stock</div>
          </div>
          <div
            className={styles.buttonWrapper}
            onClick={handleButtonWrapperClick}
          >
            <Button
              className={styles.submitButton}
              onClick={handleCartToggle}
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
