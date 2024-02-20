'use client';

import { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import ArrowForward from '@images/arrow-forward.svg';
import styles from './categories-and-products.module.scss';

export default function CategoriesAndProducts({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  const links = data.map(row => row.link);
  const products = data.map(row => row.product);

  return (
    <div className={styles.container}>
      <div className={styles.links}>
        {links.map((link, index) => (
          <>
            {link && (
              <div
                key={link.title + index}
                className={styles.linkContainer}
                onClick={() => setHoveredIndex(index)}
              >
                <Link
                  className={styles.link}
                  href={link.url || ''}
                  onMouseEnter={() => setHoveredIndex(index)}
                  dangerouslySetInnerHTML={{ __html: link.title }}
                />
                <ArrowForward />
              </div>
            )}
          </>
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
                className={clsx(styles.image, {
                  [styles.objectFitContain]:
                    product.imageCoverContain === 'contain',
                })}
                src={product.productImage?.sourceUrl}
                alt={product.productImage?.altText || ''}
                width={570}
                height={162}
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
