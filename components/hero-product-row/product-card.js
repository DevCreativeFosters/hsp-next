import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@lib/helpers';
import styles from './product-card.module.scss';

export default function ProductCard({ product }) {
  const productLink = product.link?.url || '';
  const productTitle = product.title;
  const productStartingPrice = product.startingPrice;
  const productImage = product.productImage?.sourceUrl;

  return (
    <Link href={productLink} className={styles.card}>
      <div className={styles.imageContainer}>
        <Image
          className={styles.productImage}
          src={productImage}
          alt={productTitle}
          width={168}
          height={Math.round(168 / 1.4)}
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
