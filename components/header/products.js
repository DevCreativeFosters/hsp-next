import { forwardRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@components/button/button';

import styles from './products.module.scss';

function Products({ categories, isActive, products }, ref) {
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  return (
    <div
      className={clsx(styles.container, isActive && styles.isActive)}
      ref={ref}
    >
      <ul className={styles.filterList}>
        <li className={styles.filterItem}>
          <Button
            onClick={() => setCurrentCategoryId(null)}
            variant={currentCategoryId === null ? 'quaternary' : 'tertiary'}
          >
            All
          </Button>
        </li>
        {categories?.map(({ id, name }) => (
          <li className={styles.filterItem} key={id}>
            <Button
              onClick={() => setCurrentCategoryId(id)}
              variant={currentCategoryId === id ? 'quaternary' : 'tertiary'}
            >
              {name}
            </Button>
          </li>
        ))}
      </ul>

      <ul className={styles.productList}>
        {products
          ?.filter(({ categoryId }) =>
            currentCategoryId ? categoryId === currentCategoryId : true,
          )
          .map(({ image, title, url }, index) => (
            <li className={styles.productItem} key={index}>
              <Link className={styles.productLink} href={url}>
                <div className={styles.productImageWrapper}>
                  {image && (
                    <Image
                      alt={title}
                      className={styles.productImage}
                      height={96}
                      src={image}
                      width={144}
                    />
                  )}
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
