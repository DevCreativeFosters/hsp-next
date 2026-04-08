import { forwardRef, useMemo, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@components/button/button';

import MenuArrow from '@assets/icons/arrow-next.svg';
import Arrow from '@assets/images/arrow-forward.svg';

import styles from './products.module.scss';

function Products({ categories, isActive, products }, ref) {
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  // Derive the active category name for the title
  const activeCategoryName = useMemo(() => {
    if (!currentCategoryId) return 'All Products';
    const category = categories?.find(cat => cat.id === currentCategoryId);
    return category ? category.name : 'Products';
  }, [categories, currentCategoryId]);

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
            // Fixed: "All" button check should be currentCategoryId === null
            data-active={currentCategoryId === null}
          >
            All <MenuArrow />
          </Button>
        </li>
        {categories?.map(({ id, name }) => (
          <li className={styles.filterItem} key={id}>
            <Button
              onClick={() => setCurrentCategoryId(id)}
              variant={currentCategoryId === id ? 'quaternary' : 'tertiary'}
              // Correctly pass boolean to data-active
              data-active={currentCategoryId === id}
            >
              {name} <MenuArrow />
            </Button>
          </li>
        ))}
      </ul>

      <div className={styles.rightBlockMain}>
        <h2 className={styles.categoryTitle}>{activeCategoryName}</h2>

        <ul className={styles.productList}>
          {products
            ?.filter(({ categoryId }) =>
              currentCategoryId ? categoryId === currentCategoryId : true,
            )
            .map(({ image, title, url }, index) => (
              <li className={styles.productItem} key={index}>
                <div className={styles.productLink}>
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
                  <div className={styles.productInfo}>
                    <div className={styles.productTitle}>{title}</div>
                    <div className={styles.productLinkLabel}>
                      <Link href={url}>
                        View Accessories <Arrow />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>

        <div className={styles.availableProducts}>
          <div className={styles.title}>
            Product categories available for Toyota
          </div>
          <div className={styles.allLinks}>
            <Link href="/products">Roller covers</Link>
            <Link href="/products">Tub racks</Link>
            <Link href="/products">Ladder racks</Link>
          </div>
          <div className={styles.viewAll}>
            <Link href="/products">
              View all Toyota accessories <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(Products);
