'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useCart } from '@contexts/cart-context';

import { getGlobalOptions } from '@lib/api/get-global-options';
import { getStores } from '@lib/api/get-stores';
import { formatPrice } from '@lib/helpers';

import Container from '@components/container/container';
import EnquiryModal from '@components/enquiry-form/enquiry-modal';
import Layout from '@components/layout/layout';
import Loading from '@components/loading/loading';

import processImage from '@assets/images/process-img.png';

import styles from './cart.module.scss';

export default function CartPage() {
  const [loading, setLoading] = useState(true);

  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);
  const [allLocations, setAllLocations] = useState([]);
  const [globalOptions, setGlobalOptions] = useState(null);

  const router = useRouter();

  const {
    cartItems,
    cartSubTotal,
    loading: cartLoading,
    removeFromCart,
    updateCart,
  } = useCart();

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
    <Layout title="Cart | HSP">
      <Container>
        <section className={styles.cartMain}>
          <div className={styles.heading}>
            <h2>Shopping Cart</h2>
          </div>
          <div className={styles.cartWrapper}>
            <div className={styles.cartItemsBoxes}>
              {loading ? (
                <div className={styles.loading}>
                  <Loading size="large" />
                </div>
              ) : (
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
                      <p>
                        <strong>Part No.</strong> {item.variantSlug}
                      </p>
                      <p>
                        <strong>Variant:</strong> {item.variantName}
                      </p>
                      <div className={styles.price}>
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
                            updateCart(
                              item.cart_item_key,
                              item.product_id,
                              item.quantity - 1,
                            )
                          }
                        >
                          -
                        </button>
                        <input
                          disabled={true}
                          min="0"
                          onChange={e =>
                            updateCart(
                              item.cart_item_key,
                              item.product_id,
                              e.target.value,
                            )
                          }
                          type="number"
                          value={item.quantity}
                        />
                        <button
                          className={styles.plus}
                          disabled={cartLoading}
                          onClick={() =>
                            updateCart(
                              item.cart_item_key,
                              item.product_id,
                              item.quantity + 1,
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className={styles.link}
                        onClick={() => removeFromCart(item.product_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className={styles.cartTotal}>
              <div className={styles.totalWrap}>
                <h3>Subtotal: {formatPrice(cartSubTotal)}</h3>
                <p>
                  GST Included.
                  <br />
                  Fitting or Shipping confirmed in the checkout.
                </p>
                <button
                  className={styles.button}
                  onClick={() => router.push('/checkout')}
                >
                  Check Out
                </button>
              </div>
              <div className={styles.btns}>
                <button
                  className={styles.button}
                  onClick={() => router.push('/products')}
                >
                  Continue Shopping
                </button>
                <button className={styles.button} onClick={handleOpenModal}>
                  Make an Enquiry
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.checkoutProcess}>
          <div className={styles.heading}>
            <h2>Checkout Process </h2>
            <p>
              When choosing to get your product fitted at a HSP Specialist,
              there is an easy 4 step process!
            </p>
          </div>
          <div className={styles.processWrapper}>
            <Image alt="Checkout Process" src={processImage} />
          </div>
        </section>

        {enquiryModalOpened && (
          <EnquiryModal
            enquiryFormId={globalOptions?.enquiryFormId}
            freight={priceSummary.freight}
            installationCost={priceSummary.installationCost}
            onClose={handleCloseModal}
            productPrice={priceSummary.price}
            selectedProducts={selectedProducts}
            store={selectedStore}
          />
        )}
      </Container>
    </Layout>
  );
}
