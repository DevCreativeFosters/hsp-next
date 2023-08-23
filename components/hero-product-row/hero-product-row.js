'use client';

import { useEffect, useRef } from 'react';
import ProductCard from './product-card';
import AllProductsLink from './all-products-link';
import { useIsMobile } from '@hooks/useIsMobile';
import styles from './hero-product-row.module.scss';

export default function HeroProductRow({ title, products, link }) {
  const isMobile = useIsMobile();
  const containerRef = useRef(null);

  const updateMargin = () => {
    const container = containerRef.current;
    if (container) {
      const height = container.clientHeight;
      container.style.marginBottom = `-${height + 1}px`;
    }
  };

  useEffect(() => {
    updateMargin();
    window.addEventListener('resize', updateMargin);

    return () => {
      window.removeEventListener('resize', updateMargin);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.row}>
        {products?.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
        {link && !isMobile && <AllProductsLink data={link} />}
      </div>
      {link && isMobile && <AllProductsLink data={link} />}
    </div>
  );

}
