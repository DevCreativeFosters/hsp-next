import { forwardRef, useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { makeRelativeUrl } from '@lib/helpers';

import MenuArrow from '@assets/icons/arrow-next.svg';
import Arrow from '@assets/images/arrow-forward.svg';

import styles from './products.module.scss';

function ShopByMake({ categories, isActive }, ref) {
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
      <div className={clsx(styles.leftBlock, styles.shopByMake)}>
        <ul className={styles.filterList}>
          {categories?.map(({ label, url }, index) => (
            <li
              className={styles.filterItem}
              key={`filterItem_shopbymake_${index}`}
            >
              <div
                className={clsx(styles.filterBox, {
                  [styles.active]: currentCategoryId === index,
                })}
                onClick={() => setCurrentCategoryId(index)}
              >
                <a
                  className={styles.filterText}
                  href={makeRelativeUrl(url) || '#'}
                  onClick={e => e.stopPropagation()}
                >
                  {label}
                </a>
                <MenuArrow />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.rightBlockMain}>
        <h2 className={styles.categoryTitle}>{activeCategory?.label} MODELS</h2>

        <div className={styles.productsWrapper}>
          <ul className={clsx(styles.productList, styles.shopByMake)}>
            {activeCategory?.subItems?.map(({ image, label, url }, index) => {
              if (!image?.node?.sourceUrl) return null;

              return (
                <li
                  className={styles.productItem}
                  key={`productItem_shopbymake_${index}`}
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
                        <Link href={makeRelativeUrl(url)}>
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

        <div className={styles.availableProducts}>
          <div className={styles.title}>
            Product categories available for {activeCategory?.label}
          </div>
          <div className={styles.allLinks}>
            {activeCategory?.subItems?.map(({ image, label, url }, index) => {
              if (
                image?.node?.sourceUrl ||
                index === activeCategory?.subItems?.length - 1
              ) {
                return null;
              }

              return (
                <Link href={makeRelativeUrl(url)} key={index}>
                  {label}
                </Link>
              );
            })}
          </div>
          <div className={styles.viewAll}>
            <Link
              href={
                activeCategory?.subItems[activeCategory?.subItems?.length - 1]
                  ?.url
              }
            >
              View all {activeCategory?.label} accessories <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(ShopByMake);
