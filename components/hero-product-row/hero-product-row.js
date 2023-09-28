'use client';

import { useEffect, useRef } from 'react';
import ProductCard from './product-card';
import AllProductsLink from './all-products-link';
import { useIsMobile } from '@hooks/useIsMobile';
import styles from './hero-product-row.module.scss';

const MAX_PRODUCTS = 5;
export default function HeroProductRow({ title, products, link }) {
  const isMobile = useIsMobile();
  const containerRef = useRef(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={containerRef}>
        {title && <h4 className={styles.title}>{title}</h4>}
        <div className={styles.productsContainer}>
          {products.slice(0, MAX_PRODUCTS)?.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
          {link && <AllProductsLink data={link} />}
        </div>
      </div>
    </div>
  );
}
