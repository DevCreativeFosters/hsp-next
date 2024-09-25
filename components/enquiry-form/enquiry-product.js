import Image from 'next/image';

import { formatPrice } from '@lib/helpers';

import styles from './enquiry-product.module.scss';

export default function EnquiryProduct({
  imageUrl,
  installationCost,
  name,
  price,
  sku,
}) {
  return (
    <div className={styles.product}>
      {imageUrl && (
        <div className={styles.image}>
          <Image
            alt={`${name} image`}
            className={styles.productImage}
            height={48}
            src={imageUrl}
            width={67}
          />
        </div>
      )}
      {name && (
        <p className={styles.name}>
          {name}
          {sku && <span className={styles.sku}>SKU: {sku}</span>}
        </p>
      )}
      {price !== null && price !== undefined && (
        <div className={styles.price}>
          {formatPrice(price)}{' '}
          {price !== 0 && (
            <span className={styles.installationCost}>
              {' '}
              + {formatPrice(installationCost)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
