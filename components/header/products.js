import { forwardRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import Button from '@components/button/button';
import { productCategories } from '@mockup/product-categories';
import { products } from '@mockup/products';
import styles from './products.module.scss';

function Products({ isActive }, ref) {
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  return (
    <div
      className={clsx(styles.container, isActive && styles.isActive)}
      ref={ref}
    >
      <ul className={styles.filterList}>
        <li className={styles.filterItem}>
          <Button
            variant={currentCategoryId === null ? 'quaternary' : 'tertiary'}
            onClick={() => setCurrentCategoryId(null)}
          >
            All
          </Button>
        </li>
        {productCategories.map(({ name, id }) => (
          <li className={styles.filterItem} key={id}>
            <Button
              variant={currentCategoryId === id ? 'quaternary' : 'tertiary'}
              onClick={() => setCurrentCategoryId(id)}
            >
              {name}
            </Button>
          </li>
        ))}
      </ul>

      <ul className={styles.productList}>
        {products
          .filter(({ categoryId }) =>
            currentCategoryId ? categoryId === currentCategoryId : true,
          )
          .map(({ title, url, image }, index) => (
            <li className={styles.productItem} key={index}>
              <Link className={styles.productLink} href={url}>
                <div className={styles.productImage}>
                  <Image src={image} width={144} height={96} alt={title} />
                </div>
                <div className={styles.productTitle}>{title}</div>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default forwardRef(Products);
