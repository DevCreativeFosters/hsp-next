import { forwardRef, useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@components/button/button';

import MenuArrow from '@assets/icons/arrow-next.svg';
import Arrow from '@assets/images/arrow-forward.svg';

import styles from './products.module.scss';

function Products({ categories, isActive }, ref) {
  const [currentCategoryId, setCurrentCategoryId] = useState(0);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  useEffect(() => {
    const category = categories?.find(
      (cat, index) => index === currentCategoryId,
    );
    setActiveCategory(category);
  }, [currentCategoryId]);

  if (!isActive) return null;

  return (
    <div
      className={clsx(styles.container, isActive && styles.isActive)}
      ref={ref}
    >
      <div className={styles.leftBlock}>
        <ul className={styles.filterList}>
          {categories?.map((cat, index) => {
            if (cat?.subItems?.length > 0) {
              return (
                <li
                  className={styles.filterItem}
                  key={`filterItem_products_${index}`}
                >
                  <div
                    className={clsx(styles.filterBox, {
                      [styles.active]: currentCategoryId === index,
                    })}
                    onClick={() => setCurrentCategoryId(index)}
                  >
                    <Link
                      className={styles.filterText}
                      href={cat.url || '#'}
                      onClick={e => e.stopPropagation()}
                    >
                      {cat.label}
                    </Link>
                    <MenuArrow />
                  </div>
                </li>
              );
            }

            return null;
          })}
        </ul>

        <div className={styles.directButtonLinks}>
          <div className={styles.wrap}>
            {categories?.map((cat, index) => {
              if (cat?.subItems?.length > 0) return null;

              return (
                <div
                  className={styles.buttonItem}
                  key={`buttonItem_products_${index}`}
                >
                  <Button
                    className={styles.button}
                    href={cat.url}
                    variant="secondary"
                  >
                    {cat.label}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.rightBlockMain}>
        <h2 className={styles.categoryTitle}>{activeCategory?.label}</h2>
        <div className={styles.productsWrapper}>
          <ul className={styles.productList}>
            {activeCategory?.subItems?.map(({ image, label, url }, index) => {
              return (
                <li
                  className={styles.productItem}
                  key={`productItem_products_${index}`}
                >
                  <div className={styles.productLink}>
                    <div className={styles.productImageWrapper}>
                      {image && (
                        <Image
                          alt={label}
                          className={styles.productImage}
                          height={96}
                          src={image?.node?.sourceUrl}
                          width={144}
                        />
                      )}
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.productTitle}>{label}</div>
                      <div className={styles.productLinkLabel}>
                        <Link href={url}>
                          View Accessories <Arrow />
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(Products);
