'use client';

import { useState } from 'react';

import clsx from 'clsx';

import { useAddComboToCart } from '@hooks/useAddComboToCart';

import { formatPrice } from '@lib/helpers';
import { trimSlash } from '@lib/trim-slash';

import Button from '@components/button/button';

import LocationIcon from '@assets/icons/location-icon.svg';
import SettingIcon from '@assets/icons/setting-icon.svg';
import TruckIcon from '@assets/icons/truck-icon.svg';

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

    const parentProduct = {
      databaseId: productData.databaseId,
      regularPrice: formatPrice(variantPrice),
      salePrice: formatPrice(getDiscountedItemPrice(variantPrice)),
      title: productData.title,
      variantSlug: selectedVariant?.variantSlug,
    };

    const otherComboProducts = products.map(product => ({
      databaseId: product.databaseId,
      regularPrice: formatPrice(product.productFields.price),
      salePrice: formatPrice(
        getDiscountedItemPrice(product.productFields.price),
      ),
      title: product.title,
      variantSlug: product.productFields.variants[0].variantSlug,
    }));

    const { error, ok } = await addCombo({
      products: [...otherComboProducts, parentProduct],
      quantity: 1,
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
    <>
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
          <div className={styles.productItem}>
            <div className={styles.productImage}>
              <img
                alt={`${productData.title} | ${selectedVariant?.variantName}`}
                height={80}
                src={variantImage || '/placeholder-image.jpg'}
                width={80}
              />
            </div>
            <div className={styles.productInfo}>
              <h4 className={clsx(styles.productTitle, 'p-large')}>
                {`${productData.title} | ${selectedVariant?.variantName}`}
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
          {products.map((product, index) => {
            const variant = product.productFields?.variants?.[0];
            const variantDetails = variant?.variantDetails;

            return (
              <div className={styles.productItem} key={product.id}>
                <div className={styles.productImage}>
                  <img
                    alt={`${product.title} | ${variant?.variantName}`}
                    height={80}
                    src={
                      variantDetails.images?.nodes?.[0]?.mediaItemUrl ||
                      '/placeholder-image.jpg'
                    }
                    width={80}
                  />
                </div>
                <div className={styles.productInfo}>
                  <h4 className={clsx(styles.productTitle, 'p-large')}>
                    {`${product.title} | ${variant?.variantName}`}
                  </h4>
                  <div className={clsx(styles.productPrice, 'p')}>
                    <div className={clsx(styles.regularPrice, 'p')}>
                      {formatPrice(variantDetails.price)}
                    </div>
                    <div className={clsx(styles.bundlePrice, 'p')}>
                      {formatPrice(
                        getDiscountedItemPrice(variantDetails.price),
                      )}
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

      <section className={styles.checkoutMain}>
        {/* Checkout Left */}
        <div className={styles.checkOutLeft}>
          {/* Contact Details */}
          <div className={styles.contactDetails}>
            <div className={styles.heading}>
              <h2>Contact Details</h2>
              <p>How Can We Reach You About Your Order?</p>
            </div>
            <div className={styles.formRow}>
              <div className={styles.colHalf}>
                <div className={styles.inputGroup}>
                  <label>
                    First Name<span className={styles.reqStar}>*</span>
                  </label>
                  <input type="text" />
                </div>
              </div>
              <div className={styles.colHalf}>
                <div className={styles.inputGroup}>
                  <label>
                    Last Name<span className={styles.reqStar}>*</span>
                  </label>
                  <input type="text" />
                </div>
              </div>
              <div className={styles.colFull}>
                <div className={styles.inputGroup}>
                  <label>
                    Email Address<span className={styles.reqStar}>*</span>
                  </label>
                  <input type="text" />
                </div>
              </div>
              <div className={styles.colFull}>
                <div className={styles.inputGroup}>
                  <label>
                    Mobile Number<span className={styles.reqStar}>*</span>
                  </label>
                  <input type="text" />
                </div>
              </div>
              <div className={styles.colFull}>
                <div className={styles.inputGroup}>
                  <label>
                    Company Name (Optional)
                    <span className={styles.reqStar}>*</span>
                  </label>
                  <input type="text" />
                </div>
              </div>
              <div className={styles.colFull}>
                <div className={styles.inputGroup}>
                  <div className={styles.selectOption}>
                    <label>
                      <input type="checkbox" />{' '}
                      <span>
                        I accept the Privacy Policy and Terms & Conditions
                        <a href="#">Read our T&Cs</a>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className={styles.colFull}>
                <div className={styles.inputGroup}>
                  <div className={styles.selectOption}>
                    <label>
                      <input type="checkbox" />{' '}
                      <span>
                        I agree to receiving Marketing and Promotional emails
                        from HSP
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Receive Details */}
          <div className={styles.checkOutInfo}>
            <div className={styles.heading}>
              <h2>How would you like to Receive your Order?</h2>
              <p>Choose a Delivery or Install Method</p>
            </div>
            <div className={styles.blackBoxes}>
              <div className={styles.boxItem}>
                <div className={styles.contentBox}>
                  <div className={styles.contentWrap}>
                    <h3>
                      <SettingIcon /> Local Installation
                    </h3>
                    <p>
                      Choose a local HSP fitter to get your accessories
                      installed
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.boxItem}>
                <div className={styles.contentBox}>
                  <div className={styles.contentWrap}>
                    <h3>
                      <LocationIcon /> Click & Collect
                    </h3>
                    <p>Convenient Local Pickup</p>
                  </div>
                </div>
              </div>
              <div className={styles.boxItem}>
                <div className={styles.contentBox}>
                  <div className={styles.contentWrap}>
                    <h3>
                      <TruckIcon /> Deliver to Door
                    </h3>
                    <p>Sent within 1-3 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Right */}
        <div className={styles.checkOutRight}>
          <div className={styles.checkOutItemsMain}>
            <h3>Products</h3>
            <div className={styles.checkOutItem}>
              <div className={styles.itemImg}>
                <img src="https://wordpress-1505184-5847603.cloudwaysapps.com/wp-content/uploads/2024/08/A12-Web.jpg" />
              </div>
              <div className={styles.itemInfo}>
                <h6>HSP Roll R Cover 3.5 for Ford Ranger Raptor</h6>
                <p>
                  Qty: 1 <a href="#">View Details</a>
                </p>
              </div>
              <div className={styles.itemPrice}>$3,300.00</div>
            </div>
            <div className={styles.checkOutItem}>
              <div className={styles.itemImg}>
                <img src="https://wordpress-1505184-5847603.cloudwaysapps.com/wp-content/uploads/2024/08/A12-Web.jpg" />
              </div>
              <div className={styles.itemInfo}>
                <h6>HSP Roll R Cover 3.5 for Ford Ranger Raptor</h6>
                <p>
                  Qty: 1 <a href="#">View Details</a>
                </p>
              </div>
              <div className={styles.itemPrice}>$3,300.00</div>
            </div>
            <div className={styles.couponBlock}>
              <input type="text" />
              <button className={styles.couponBtn} disabled>
                Apply
              </button>
            </div>
            <div className={styles.checkoutSummary}>
              <h3>Summary</h3>
              <div className={styles.subTotal}>
                <div className={styles.subTotaltitle}>Subtotal</div>
                <div className={styles.subTotalPrice}>$6,600.00</div>
              </div>
              <div className={styles.finalTotal}>
                <div className={styles.finalTotaltitle}>TOTAL</div>
                <div className={styles.finalTotalPrice}>
                  AUD 6,600.00<span>(incl. 10% GST)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
