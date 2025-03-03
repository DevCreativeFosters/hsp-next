import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '@lib/helpers';

import { slideImageSizes } from '@components/builder/products-carousel';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './product-card.module.scss';

export default function ProductCard({ product }) {
  const productLink = product.link?.url || '';
  const productTitle = product.title;
  const productTitleTag = product.titleTag;
  const productTitleStyle = product.titleTagStyle;
  const productStartingPrice = product.startingPrice;
  const productImage = product.productImage?.node?.sourceUrl;

  return (
    <Link className={styles.card} href={productLink}>
      <div className={styles.imageContainer}>
        <Image
          alt={productTitle}
          className={styles.productImage}
          height={slideImageSizes.height}
          src={productImage}
          width={slideImageSizes.width}
        />
      </div>
      {productTitle && (
        <DynamicTitle
          className={styles.productName}
          defaultTag="p"
          titleTag={productTitleTag}
          titleTagStyle={productTitleStyle}
        >
          {productTitle}
        </DynamicTitle>
      )}
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
