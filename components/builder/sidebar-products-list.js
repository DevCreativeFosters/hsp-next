'use client';

import clsx from 'clsx';

import { formatPrice } from '@lib/helpers';
import { getIcon } from '@lib/icons';

import styles from './sidebar.module.scss';

const CancelIcon = getIcon('cancel');

export default function ProductsList({ removeProduct, selectedProducts }) {
  return (
    <>
      {selectedProducts.length !== 0 ? (
        <ol className={styles.productsList}>
          {selectedProducts?.map((selectedProduct, index) => {
            const { price, productName, slug } = selectedProduct;

            return (
              <li className={styles.productsListItem} key={`${slug}_${index}`}>
                <div className={styles.productBox}>
                  {formatPrice(price)}
                  <span className={styles.productBoxName}>{productName}</span>
                </div>
                <button
                  className={styles.productRemove}
                  onClick={() => removeProduct(selectedProduct)}
                  type="button"
                >
                  <CancelIcon />
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className={styles.noProducts}>
          Select products from the bottom of the screen to create a quote.
          <div className={clsx(styles.productBox, styles.isEmpty)}>
            No products added yet
          </div>
        </div>
      )}
    </>
  );
}
