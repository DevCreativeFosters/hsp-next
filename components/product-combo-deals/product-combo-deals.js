'use client';

import { useState } from 'react';

import clsx from 'clsx';

import { useCart } from '@contexts/cart-context';

import { formatPrice } from '@lib/helpers';
import { trimSlash } from '@lib/trim-slash';

import Button from '@components/button/button';

import styles from './product-combo-deals.module.scss';

export default function ProductComboDeals({
  comboDeals,
  productData,
  variantSlug,
}) {
  const [openAccordion, setOpenAccordion] = useState(null);
  const { addMultipleToCart, loading } = useCart();

  if (
    !comboDeals ||
    !comboDeals.applyIfCombo ||
    !comboDeals.comboProducts?.edges?.length
  ) {
    return null;
  }

  const { bundlePrice, comboProducts, discountType, discountValue } =
    comboDeals;
  const products = comboProducts.edges.map(edge => edge.node);

  // get variant & pricing exactly like before…
  const productFields = productData.productFields;
  const productPrice = productFields?.price;
  const variants = productFields?.variants;

  const selectedVariant =
    variants?.find(
      ({ variantSlug: slug }) => trimSlash(slug) === variantSlug,
    ) || variants?.[0];

  const variantPrice =
    selectedVariant?.variantDetails?.price ??
    (selectedVariant?.parentInherit ? productPrice : null);

  const variantImage =
    selectedVariant?.variantDetails?.images?.nodes?.[0]?.mediaItemUrl ||
    productData?.productFields?.images?.nodes?.[0]?.mediaItemUrl;

  const totalRegularPrice =
    products.reduce(
      (total, product) =>
        total +
        (product.productFields?.variants?.[0]?.variantDetails?.price || 0),
      0,
    ) + (variantPrice || 0);

  let savings = 0;
  let savingsPercentage = 0;

  if (discountValue === 'percentage') {
    savingsPercentage = parseFloat(bundlePrice);
    savings = (totalRegularPrice * savingsPercentage) / 100;
  } else if (discountValue === 'fixed') {
    savings = parseFloat(bundlePrice);
    savingsPercentage = Math.round((savings / totalRegularPrice) * 100);
  }

  const discountedPrice = totalRegularPrice - savings;

  const totalInstallationCost =
    (selectedVariant?.variantDetails?.installationCost || 0) +
    products.reduce(
      (total, product) =>
        total +
        (product.productFields?.variants?.[0]?.variantDetails
          ?.installationCost || 0),
      0,
    );

  const getDiscountedItemPrice = itemPrice => {
    if (!itemPrice || totalRegularPrice === 0) return itemPrice;
    const ratio = itemPrice / totalRegularPrice;
    return discountedPrice * ratio;
  };

  return (
    <>
      <div className={styles.comboDeals}>
        <div className={styles.header}>
          <h3 className={clsx(styles.title, 'h4')}>Bundle & Save</h3>
        </div>
        <div className={styles.productWrap}>
          <div className={styles.products}>
            {/* Current product variant */}
            <div className={styles.productItem}>
              <div className={styles.productImage}>
                <img
                  alt={productData.title}
                  height={80}
                  src={variantImage || '/placeholder-image.jpg'}
                  width={80}
                />
              </div>
              <div className={styles.productInfo}>
                <h4
                  className={clsx(styles.productTitle, 'p-large')}
                  onClick={() => setOpenAccordion('main')}
                >
                  {productData.title}
                  <div
                    className={clsx(
                      styles.accordionArrow,
                      openAccordion === 'main' && styles.accordionArrowOpen,
                    )}
                  >
                    <svg fill="none" height="8" viewBox="0 0 12 8" width="12">
                      <path
                        d="M1.406 0.000249863L6 4.59425L10.594 0.000249863L12 1.40625L6 7.40625L0 1.40625L1.406 0.000249863Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </h4>
                <div
                  className={clsx(
                    styles.prdtailMain,
                    styles.accordionBody,
                    openAccordion === 'main' && styles.accordionBodyOpen,
                  )}
                >
                  <div className={styles.prdskuTxt}>
                    SKU: {selectedVariant?.sku}
                  </div>
                  <div className={clsx(styles.productPrice)}>
                    <div className={clsx(styles.bundlePrice, 'p')}>
                      {formatPrice(getDiscountedItemPrice(variantPrice))}
                    </div>
                    <div className={clsx(styles.regularPrice, 'p')}>
                      {formatPrice(variantPrice)}
                    </div>
                  </div>
                  <div className={styles.prdinstallTxt}>
                    +{' '}
                    {formatPrice(
                      selectedVariant?.variantDetails?.installationCost,
                    )}{' '}
                    for Install
                  </div>
                </div>
              </div>
              <div className={styles.plusSign}>+</div>
            </div>
            {/* Combo products */}
            {products.map((product, index) => {
              const variant = product.productFields?.variants?.[0];
              const variantDetails = variant?.variantDetails;
              const variantImage =
                variantDetails.images?.nodes?.[0]?.mediaItemUrl ||
                product?.productFields?.images?.nodes?.[0]?.mediaItemUrl;

              return (
                <div className={styles.productItem} key={product.id}>
                  <div className={styles.productImage}>
                    <img
                      alt={product.title}
                      height={80}
                      src={variantImage || '/placeholder-image.jpg'}
                      width={80}
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h4 className={clsx(styles.productTitle, 'p-large')}>
                      {product.title}
                    </h4>
                    <div className={styles.prdtailMain}>
                      <div className={styles.prdskuTxt}>SKU: {variant.sku}</div>
                      <div className={clsx(styles.productPrice, 'p')}>
                        <div className={clsx(styles.bundlePrice, 'p')}>
                          {formatPrice(
                            getDiscountedItemPrice(variantDetails.price),
                          )}
                        </div>
                        <div className={clsx(styles.regularPrice, 'p')}>
                          {formatPrice(variantDetails.price)}
                        </div>
                      </div>
                      <div className={styles.prdinstallTxt}>
                        + {formatPrice(variantDetails?.installationCost)} for
                        Install
                      </div>
                    </div>
                  </div>
                  {index < products.length - 1 && (
                    <div className={styles.plusSign}>+</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className={styles.pricing}>
            <div className={styles.prdPriceMain}>
              <div className={styles.bundlePrice}>
                {formatPrice(discountedPrice)}
              </div>
              <div className={styles.regularPrice}>
                {formatPrice(totalRegularPrice)}
              </div>
            </div>
            <div className={styles.prinstallTxt}>
              + {formatPrice(totalInstallationCost)} for Install
            </div>
            <div className={styles.addToCart}>
              <Button
                className={clsx(
                  styles.addToCartButton,
                  loading && styles.loading,
                )}
                disabled={loading}
                onClick={() => {
                  const items = products.map(product => {
                    const variant = product.productFields?.variants?.[0];
                    return {
                      quantity: 1,
                      variant_name: variant?.variantName,
                      variant_sku: variant?.sku,
                      variant_slug: variant?.variantSlug,
                    };
                  });
                  addMultipleToCart([
                    {
                      quantity: 1,
                      variant_name: selectedVariant?.variantName,
                      variant_sku: selectedVariant?.sku,
                      variant_slug: selectedVariant?.variantSlug,
                    },
                    ...items,
                  ]);
                }}
                variant="primary"
              >
                <svg
                  fill="none"
                  height="18"
                  viewBox="0 0 18 18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_4695_43393)">
                    <path
                      d="M6 16.5C6.41421 16.5 6.75 16.1642 6.75 15.75C6.75 15.3358 6.41421 15 6 15C5.58579 15 5.25 15.3358 5.25 15.75C5.25 16.1642 5.58579 16.5 6 16.5Z"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M14.25 16.5C14.6642 16.5 15 16.1642 15 15.75C15 15.3358 14.6642 15 14.25 15C13.8358 15 13.5 15.3358 13.5 15.75C13.5 16.1642 13.8358 16.5 14.25 16.5Z"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M1.53711 1.53906H3.03711L5.03211 10.8541C5.10529 11.1952 5.29511 11.5002 5.56889 11.7165C5.84267 11.9327 6.18329 12.0468 6.53211 12.0391H13.8671C14.2085 12.0385 14.5395 11.9215 14.8054 11.7074C15.0713 11.4933 15.2562 11.195 15.3296 10.8616L16.5671 5.28906H3.83961"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4695_43393">
                      <rect fill="white" height="18" width="18" />
                    </clipPath>
                  </defs>
                </svg>
                {loading ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>
            </div>
            <div className={styles.priceNotesTxt}>
              Total Bundle Discounts Applied at Checkout
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
