'use client';

import { useMemo, useState } from 'react';

import clsx from 'clsx';

import { useCart } from '@contexts/cart-context';

import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';

import styles from './product-combo-deals.module.scss';

export default function ProductComboDeals({ comboDeals, dealName }) {
  const [openAccordion, setOpenAccordion] = useState(null);
  const { addBundleToCart, loading } = useCart();

  const { discountedPrice, totalInstallationCost, totalRegularPrice } = useMemo(
    () =>
      comboDeals.reduce(
        (acc, deal) => {
          const variant = deal.product.nodes[0]?.productFields?.variants?.find(
            v => v.sku === deal.variantSku,
          );
          return {
            discountedPrice: acc.discountedPrice + (deal.variantPrice ?? 0),
            totalInstallationCost:
              acc.totalInstallationCost +
              (variant?.variantDetails?.installationCost ?? 0),
            totalRegularPrice:
              acc.totalRegularPrice + (variant?.variantDetails?.price ?? 0),
          };
        },
        { discountedPrice: 0, totalInstallationCost: 0, totalRegularPrice: 0 },
      ),
    [comboDeals],
  );

  const products = comboDeals?.map(deal => deal.product.nodes[0]);

  const handleAddToCart = () => {
    const items = comboDeals.map(deal => {
      const variant = deal.product.nodes[0]?.productFields?.variants?.find(
        v => v.sku === deal.variantSku,
      );
      return {
        quantity: 1,
        variant_name: variant?.variantName,
        variant_price: deal.variantPrice,
        variant_sku: variant?.sku,
        variant_slug: variant?.variantSlug,
      };
    });
    addBundleToCart(items);
  };

  return (
    <>
      <div className={styles.comboDeals}>
        <div className={styles.header}>
          <h3 className={clsx(styles.title, 'h4')}>{dealName}</h3>
        </div>
        <div className={styles.productWrap}>
          <div className={styles.products}>
            {comboDeals.map((deal, index) => {
              const product = deal.product.nodes[0];
              const variant = product.productFields?.variants?.find(
                variant => variant.sku === deal.variantSku,
              );

              const variantDetails = variant?.variantDetails;

              return (
                <div className={styles.productItem} key={product.id}>
                  <div className={styles.productImage}>
                    <img
                      alt={product.title}
                      height={80}
                      src={deal?.image?.node?.sourceUrl}
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
                          {formatPrice(deal.variantPrice)}
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
                onClick={handleAddToCart}
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
