'use client';

import { useState } from 'react';

import Image from 'next/image';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import processImage from '@assets/images/process-img.png';

import styles from './cart.module.scss';

export default function CartPage() {
  const [quantity, setQuantity] = useState(1);
  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };
  const handleDecrease = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
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
              <div className={styles.itemBox}>
                <figure>{/* <img src=""> */}</figure>
                <div className={styles.wContent}>
                  <h4>Roll R Cover 3.5 for Ford Ranger Raptor</h4>
                  <p>
                    <strong>Part No.</strong> NGR42RS3.5
                  </p>
                  <p>
                    <strong>Variant:</strong> Ranger Raptor suits no sport bars
                  </p>
                  <div className={styles.price}>$3,300.00</div>
                </div>
                <div className={styles.wActions}>
                  <div className={styles.qtyBlock}>
                    <button className={styles.minus} onClick={handleDecrease}>
                      -
                    </button>
                    <input min="1" readOnly type="number" value={quantity} />
                    <button className={styles.plus} onClick={handleIncrease}>
                      +
                    </button>
                  </div>
                  <button className={styles.link}>Remove</button>
                </div>
              </div>

              <div className={styles.itemBox}>
                <figure>{/* <img src=""> */}</figure>
                <div className={styles.wContent}>
                  <h4>Roll R Cover 3.5 for Ford Ranger Raptor</h4>
                  <p>
                    <strong>Part No.</strong> NGR42RS3.5
                  </p>
                  <p>
                    <strong>Variant:</strong> Ranger Raptor suits no sport bars
                  </p>
                  <div className={styles.price}>$3,300.00</div>
                </div>
                <div className={styles.wActions}>
                  <div className={styles.qtyBlock}>
                    <button className={styles.minus} onClick={handleDecrease}>
                      -
                    </button>
                    <input min="1" readOnly type="number" value={quantity} />
                    <button className={styles.plus} onClick={handleIncrease}>
                      +
                    </button>
                  </div>
                  <button className={styles.link}>Remove</button>
                </div>
              </div>
            </div>

            <div className={styles.cartTotal}>
              <div className={styles.totalWrap}>
                <h3>Subtotal: $6,500.00</h3>
                <p>
                  GST Included.
                  <br />
                  Fitting or Shipping confirmed in the checkout.
                </p>
                <button className={styles.button}>CHECK OUT</button>
                <button className={styles.link}>Email me my Cart/ Quote</button>
              </div>
              <div className={styles.btns}>
                <button className={styles.button}>CONTINUE SHOPPING</button>
                <button className={styles.button}>MAKE AN ENQUIRY</button>
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
            <Image src={processImage} />
          </div>
        </section>
      </Container>
    </Layout>
  );
}
