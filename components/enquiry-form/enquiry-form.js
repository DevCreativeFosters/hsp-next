'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { useCart } from '@contexts/cart-context';
import StoreLocatorContext from '@contexts/store-locator';
import { useUserContext } from '@contexts/user';

import useMobileVh from '@hooks/useMobileVh';

import { formatPrice, getProductImage } from '@lib/helpers';
import normalizeStores from '@lib/normalize-stores';
import { trimSlash } from '@lib/trim-slash';

import Button from '@components/button/button';
import Select from '@components/form/select';
import Loading from '@components/loading/loading';

import PlusIcon from '@assets/icons/plus.svg';

import styles from './enquiry-form.module.scss';
import EnquiryModal from './enquiry-modal';

export default function EnquiryForm({
  allLocations,
  enquiryFormId,
  mainCategory,
  onVariantChange: onVariantChangeCallback = slug => {},
  productData,
  showStoreSearchcontrols,
  variantSlug,
}) {
  const { loading: userLoading, user } = useUserContext();
  const role = user?.role || 'retail';

  const [_, setIsFormValid] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);
  const isOutOfStock =
    productData.stockStatus === 'OUT_OF_STOCK' ||
    productData.stockQuantity <= 0;

  const [normalizedLocations, setNormalizedLocations] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Assuming useCart provides isCartOpen
  const { addToCart, loading } = useCart();

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
              (variantOptions?.length ? variantOptions?.[0].value : '') // Corrected initial value for select
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
            {!isOutOfStock && (
              <div className={clsx(styles.productStatus, styles.statusInstock)}>
                In Stock
              </div>
            )}
            {isOutOfStock && (
              <div
                className={clsx(styles.productStatus, styles.statusOutOfstock)}
              >
                Out of Stock
              </div>
            )}
            <div className={styles.qtyAndBtns}>
              <div className={styles.qtyBlock}>
                <button
                  className={styles.minus}
                  disabled={isOutOfStock || quantity <= 1} // Disable minus if quantity is 1
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
              <div
                className={styles.buttonWrapper}
                onClick={handleButtonWrapperClick}
              >
                <Button
                  className={styles.submitButton}
                  disabled={isOutOfStock || loading} // Disable button while adding to cart
                  onClick={() => addToCart(productData.databaseId, quantity)}
                  size="large"
                >
                  Add to Cart{' '}
                  {loading && <Loading color="white" size="small" />}
                </Button>
                <Button
                  className={styles.submitButton}
                  onClick={handleOpenModal}
                  size="large"
                >
                  Make an enquiry
                </Button>
              </div>
            </div>
            {userLoading ? (
              <div className={styles.cmpProduct}>
                <Loading color="white" size="large" />
              </div>
            ) : (
              role === 'retail' &&
              productData?.compatibleProduct?.selectProduct?.length > 0 && (
                <div className={styles.cmpProduct}>
                  <div className={styles.title}>Also Compatible with:</div>
                  {productData.compatibleProduct.selectProduct.map(item => {
                    const img = item?.uploadProductImage?.node;
                    const product = item?.product?.nodes[0];
                    const variantDetails =
                      product?.productFields?.variants[0]?.variantDetails;

                    return (
                      <div className={styles.cmpBox} key={product?.databaseId}>
                        <figure>
                          <Image
                            alt={img.altText}
                            height={55}
                            src={img.sourceUrl}
                            width={55}
                          />
                        </figure>
                        <div className={styles.info}>
                          <h5>
                            {product?.title}{' '}
                            <PlusIcon
                              className={styles.icon}
                              onClick={() => addToCart(product?.databaseId, 1)}
                            />
                          </h5>
                          <div className={styles.price}>
                            <div className={styles.one}>
                              {formatPrice(variantDetails?.price)}
                            </div>
                            {variantDetails?.compareAtPrice && (
                              <div className={styles.two}>
                                {formatPrice(variantDetails?.compareAtPrice)}
                              </div>
                            )}
                            <div className={styles.three}>
                              + {formatPrice(variantDetails?.installationCost)}{' '}
                              for install
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
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
            showStoreSearchcontrols={showStoreSearchcontrols}
            store={selectedStore}
          />
        )}
      </section>
    </>
  );
}
