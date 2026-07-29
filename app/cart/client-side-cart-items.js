'use client';

import { useContext, useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useCart } from '@contexts/cart-context';
import StoreLocatorContext from '@contexts/store-locator';

import { getGlobalOptions } from '@lib/api/get-global-options';
import { getStores } from '@lib/api/get-stores';
import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';
import EnquiryModal from '@components/enquiry-form/enquiry-modal';
import Loading from '@components/loading/loading';

import styles from './cart.module.scss';

const DEFAULT_PRICE_SUMMARY = {
  freight: 0,
  installationCost: 0,
  price: 0,
};

export default function ClientSideCartItems() {
  const [loading, setLoading] = useState(true);

  const [priceSummary, setPriceSummary] = useState(DEFAULT_PRICE_SUMMARY);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);
  const [allLocations, setAllLocations] = useState([]);
  const [globalOptions, setGlobalOptions] = useState(null);

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const router = useRouter();

  const {
    cartItems,
    cartSubTotal,
    loading: cartLoading,
    removeFromCart,
    updateCart,
  } = useCart();

  const { selectedStore } = useContext(StoreLocatorContext);

  const lastProductSlug =
    cartItems.length > 0
      ? `${cartItems[cartItems.length - 1].product_slug}`
      : '/products';

  useEffect(() => {
    async function fetchData() {
      const stores = await getStores();
      const options = await getGlobalOptions();
      setAllLocations(stores);
      setGlobalOptions(options);
    }
    fetchData();
  }, []);

  useEffect(
    function calculatePrice() {
      const products = cartItems.map(item => {
        return {
          ...item,
          image: item.product_image,
          installationCost: item.installation_cost,
          productName: item.product_name,
          sku: item.variantSku,
        };
      });

      setSelectedProducts(products);

      let newPriceSummary = products.reduce((accumulator, currentProduct) => {
        const newAccumulator = {
          freight: accumulator.freight + (currentProduct.freight || 0),
          installationCost:
            accumulator.installationCost +
            (currentProduct.installationCost || 0),
          price: accumulator.price + (currentProduct.price || 0),
        };

        return newAccumulator;
      }, DEFAULT_PRICE_SUMMARY);

      setPriceSummary(newPriceSummary);
    },
    [cartItems],
  );

  useEffect(() => {
    if (!cartLoading) setLoading(false);
  }, [cartLoading]);

  const enquiryFormId = globalOptions?.enquiryFormId;

  const handleOpenModal = () => {
    setEnquiryModalOpened(true);
  };

  const handleCloseModal = () => {
    setEnquiryModalOpened(false);
  };

  return (
    <>
      <section className={styles.cartMain}>
        <div className={styles.heading}>
          <h2>Shopping Cart</h2>
        </div>
        <div className={styles.cartWrapper}>
          <div
            className={clsx(styles.cartItemsBoxes, {
              [styles.empty]: cartItems.length === 0,
            })}
          >
            {loading ? (
              <div className={styles.loading}>
                <Loading size="large" />
              </div>
            ) : cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div className={styles.itemBox} key={index}>
                  <figure>
                    <Image
                      alt={item.product_name}
                      height={100}
                      src={item.product_image}
                      width={100}
                    />
                  </figure>
                  <div className={styles.wContent}>
                    <h4>{item.product_name}</h4>
                    {item.variantSlug && (
                      <p>
                        <strong>Part No.</strong> {item.variantSlug}
                      </p>
                    )}
                    {item.variantName && (
                      <p>
                        <strong>Variant:</strong> {item.variantName}
                      </p>
                    )}
                    <div
                      className={clsx(styles.price, {
                        black: !item?.compareAtPrice,
                      })}
                    >
                      {formatPrice(item.price)}{' '}
                      {!!item?.compareAtPrice && (
                        <del>{formatPrice(item.compareAtPrice)}</del>
                      )}
                    </div>
                  </div>
                  <div className={styles.wActions}>
                    <div className={styles.qtyBlock}>
                      <button
                        className={styles.minus}
                        disabled={cartLoading}
                        onClick={() =>
                          updateCart({
                            cartItemKey: item.cart_item_key,
                            productId: item.product_id,
                            quantity: item.quantity - 1,
                            variant_name: item.variantName,
                            variant_sku: item.variantSku,
                            variant_slug: item.variantSlug,
                          })
                        }
                      >
                        -
                      </button>
                      <input
                        disabled={true}
                        min="0"
                        onChange={e =>
                          updateCart({
                            cartItemKey: item.cart_item_key,
                            productId: item.product_id,
                            quantity: e.target.value,
                            variant_name: item.variantName,
                            variant_sku: item.variantSku,
                            variant_slug: item.variantSlug,
                          })
                        }
                        type="number"
                        value={item.quantity}
                      />
                      <button
                        className={styles.plus}
                        disabled={cartLoading}
                        onClick={() =>
                          updateCart({
                            cartItemKey: item.cart_item_key,
                            productId: item.product_id,
                            quantity: item.quantity + 1,
                            variant_name: item.variantName,
                            variant_sku: item.variantSku,
                            variant_slug: item.variantSlug,
                          })
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles.link}
                      onClick={() => removeFromCart(item.cart_item_key)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyCart}>
                <h3>There are no products in your cart right now</h3>
                <Button
                  onClick={() => router.push('/products')}
                  size="large"
                  variant="primary"
                >
                  Start Shopping
                </Button>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className={styles.cartTotal}>
              <div className={styles.totalWrap}>
                <h3>Subtotal: {formatPrice(cartSubTotal)}</h3>
                <p>
                  GST Included.
                  <br />
                  Fitment and delivery costs will be confirmed in the checkout
                </p>
                <div className={styles.agreeCheckbox}>
                  <label>
                    <input
                      checked={agreedToTerms}
                      id="agreeTerms"
                      onChange={e => setAgreedToTerms(e.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      I understand that items in my cart are variant-specific
                      and have confirmed the correct variant before checkout.
                    </span>
                  </label>
                </div>
                <Button
                  className={styles.button}
                  disabled={!agreedToTerms || cartItems.length === 0}
                  href="/checkout"
                >
                  Check Out
                </Button>
              </div>
              <div className={styles.btns}>
                <button
                  className={styles.button}
                  onClick={() => router.push('/products')}
                >
                  Continue Shopping
                </button>
                <button className={styles.button} onClick={handleOpenModal}>
                  Make Enquiry
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      {enquiryModalOpened && (
        <EnquiryModal
          allLocations={allLocations}
          enquiryFormId={globalOptions?.enquiryFormId}
          freight={priceSummary.freight}
          installationCost={priceSummary.installationCost}
          onClose={handleCloseModal}
          productPrice={priceSummary.price}
          selectedProducts={selectedProducts}
          showStoreSearchcontrols={true}
          store={selectedStore}
        />
      )}
    </>
  );
}
