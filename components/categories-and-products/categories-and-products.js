'use client';

import { Fragment, useState } from 'react';

import ArrowForward from '@images/arrow-forward.svg';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import styles from './categories-and-products.module.scss';

export default function CategoriesAndProducts({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  const links = data.map(row => row.link);
  const products = data.map(row => row.product);

  return (
    <div className={styles.container}>
      <div className={styles.links}>
        {links.map((link, index) => (
          <Fragment key={link.title + index}>
            {link && (
              <div
                className={styles.linkContainer}
                onClick={() => setHoveredIndex(index)}
              >
                <Link
                  className={styles.link}
                  dangerouslySetInnerHTML={{ __html: link.title }}
                  href={link.url || ''}
                  onMouseEnter={() => setHoveredIndex(index)}
                />
                <ArrowForward />
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div className={styles.products}>
        {products.map((product, index) => (
          <div
            className={styles.product}
            key={product.productTitle + index}
            style={{ display: hoveredIndex === index ? 'flex' : 'none' }}
          >
            <div className={styles.imageContainer}>
              <Image
                alt={product.productImage?.node?.altText || ''}
                className={clsx(styles.image, {
                  [styles.objectFitContain]:
                    product.imageCoverContain === 'contain',
                })}
                height={162}
                src={product.productImage?.node?.sourceUrl}
                width={570}
              />
            </div>
            <div>
              <h5 className={styles.productTitle}>{product.productTitle}</h5>
              <span className={styles.productPrice}>
                from ${product.productPrice.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
