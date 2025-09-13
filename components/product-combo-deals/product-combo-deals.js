'use client';

import { useState } from 'react';

import clsx from 'clsx';

import { useAddComboToCart } from '@hooks/useAddComboToCart';

import { formatPrice } from '@lib/helpers';
import { trimSlash } from '@lib/trim-slash';

import Button from '@components/button/button';

import styles from './product-combo-deals.module.scss';

export default function ProductComboDeals({
  comboDeals,
  productData,
  variantSlug,
}) {
  const [addToCartMessage, setAddToCartMessage] = useState('');

  const { addCombo, loading } = useAddComboToCart();

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
      (total, product) => total + (product.productFields?.price || 0),
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

  const getDiscountedItemPrice = itemPrice => {
    if (!itemPrice || totalRegularPrice === 0) return itemPrice;
    const ratio = itemPrice / totalRegularPrice;
    return discountedPrice * ratio;
  };

  const handleAddToCart = async () => {
    setAddToCartMessage('');

    console.log({
      bundlePrice: discountedPrice,
      comboProductIds: products.map(p => p.databaseId),
      parentProductId: productData.databaseId,
      quantity: 1,
      variantSlug: selectedVariant?.variantSlug,
    });

    const { error, ok } = await addCombo({
      bundlePrice: discountedPrice,
      comboProductIds: products.map(p => p.databaseId),
      parentProductId: productData.databaseId,
      quantity: 1,
      variantSlug: selectedVariant?.variantSlug,
    });

    if (ok) {
      setAddToCartMessage('✅ Combo added to cart successfully');
      openCart();
      // optionally refresh cart here
    } else {
      setAddToCartMessage(`❌ Failed to add combo: ${error}`);
    }
  };

  // Function to open cart
  const openCart = () => {
    // Check if you have a cart sidebar component
    if (typeof window !== 'undefined') {
      // Dispatch a custom event to open the cart
      window.dispatchEvent(new CustomEvent('openCart'));

      // Alternatively, if you're using a state management solution:
      // setCartOpen(true);

      // Or redirect to cart page:
      // window.location.href = '/cart';
    }
  };

  return (
    <div className={styles.comboDeals}>
      <div className={styles.header}>
        <h3 className={clsx(styles.title, 'h4')}>Combo Deal</h3>
        <div className={styles.badge}>
          Save{' '}
          {discountValue === 'percentage'
            ? `${savingsPercentage}%`
            : formatPrice(savings)}
        </div>
      </div>

      <div className={styles.products}>
        {/* Current product variant */}
        <div className={styles.productItem} key={productData.id}>
          <div className={styles.productImage}>
            <img
              alt={productData.title}
              height={80}
              src={variantImage || '/placeholder-image.jpg'}
              width={80}
            />
          </div>
          <div className={styles.productInfo}>
            <h4 className={clsx(styles.productTitle, 'p-large')}>
              {productData.title} | {selectedVariant?.variantName}
            </h4>
            <div className={clsx(styles.productPrice)}>
              <div className={clsx(styles.regularPrice, 'p')}>
                {formatPrice(variantPrice)}
              </div>
              <div className={clsx(styles.bundlePrice, 'p')}>
                {formatPrice(getDiscountedItemPrice(variantPrice))}
              </div>
            </div>
          </div>
          <div className={styles.plusSign}>+</div>
        </div>

        {/* Combo products */}
        {products.map((product, index) => (
          <div className={styles.productItem} key={product.id}>
            <div className={styles.productImage}>
              <img
                alt={product.title}
                height={80}
                src={
                  product.productFields?.images?.nodes?.[0]?.mediaItemUrl ||
                  '/placeholder-image.jpg'
                }
                width={80}
              />
            </div>
            <div className={styles.productInfo}>
              <h4 className={clsx(styles.productTitle, 'p-large')}>
                {product.title}
              </h4>
              <div className={clsx(styles.productPrice, 'p')}>
                <div className={clsx(styles.regularPrice, 'p')}>
                  {formatPrice(product.productFields?.price)}
                </div>
                <div className={clsx(styles.bundlePrice, 'p')}>
                  {formatPrice(
                    getDiscountedItemPrice(product.productFields?.price),
                  )}
                </div>
              </div>
            </div>
            {index < products.length - 1 && (
              <div className={styles.plusSign}>+</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.pricing}>
        <div className={styles.regularPrice}>
          Regular: {formatPrice(totalRegularPrice)}
        </div>
        <div className={styles.bundlePrice}>
          Bundle: {formatPrice(discountedPrice)}
        </div>
        <div className={styles.savings}>
          You save: {formatPrice(savings)}
          {discountValue === 'percentage' && ` (${savingsPercentage}%)`}
        </div>
      </div>

      <div className={styles.discountInfo}>
        <p className={clsx(styles.discountDescription, 'p')}>
          {discountType}:{' '}
          {discountValue === 'percentage'
            ? `${savingsPercentage}% discount applied when purchased together`
            : `${formatPrice(savings)} discount applied when purchased together`}
        </p>
      </div>
      <div className={styles.addToCart}>
        <Button
          className={clsx(styles.addToCartButton, loading && styles.loading)}
          disabled={loading}
          onClick={handleAddToCart}
          variant="primary"
        >
          {loading ? 'Adding to Cart...' : 'Add Combo to Cart'}
        </Button>
        {addToCartMessage && (
          <div
            className={clsx(
              styles.message,
              addToCartMessage.includes('success')
                ? styles.success
                : styles.error,
            )}
          >
            {addToCartMessage}
          </div>
        )}
      </div>
    </div>
  );
}
