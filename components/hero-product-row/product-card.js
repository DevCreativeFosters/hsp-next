import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '@lib/helpers';

import styles from './product-card.module.scss';

export default function ProductCard({ product }) {
  const productLink = product.link?.url || '';
  const productTitle = product.title;
  const productStartingPrice = product.startingPrice;
  const productImage = product.productImage?.node?.sourceUrl;

  return (
    <Link className={styles.card} href={productLink}>
      <div className={styles.imageContainer}>
        <Image
          alt={productTitle}
          className={styles.productImage}
          height={Math.round(168 / 1.4)}
          src={productImage}
          width={168}
        />
      </div>
      {productTitle && <p className={styles.productName}>{productTitle}</p>}
      {productStartingPrice && (
        <p className={styles.productStartingPrice}>
          Starting from{' '}
          <span className={styles.productStartingPriceValue}>
            {formatPrice(productStartingPrice)}
          </span>
        </p>
      )}
    </Link>
  );
}
