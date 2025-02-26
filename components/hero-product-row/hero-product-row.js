'use client';

import DynamicTitle from '@components/dynamic-title/dynamic-title';

import AllProductsLink from './all-products-link';
import styles from './hero-product-row.module.scss';
import ProductCard from './product-card';

const MAX_PRODUCTS = 5;
export default function HeroProductRow({
  link,
  products,
  title,
  titleTag,
  titleTagStyle,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {title && (
          <DynamicTitle
            className={styles.title}
            defaultTag="h4"
            titleTag={titleTag}
            titleTagStyle={titleTagStyle}
          >
            {title}
          </DynamicTitle>
        )}
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
