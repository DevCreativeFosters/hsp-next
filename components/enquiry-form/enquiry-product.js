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
          {formatPrice(price)}
          {/* Only render the install line when there's a real number —
              a missing/NaN installationCost previously printed "$NaN",
              and the bare "+ $550.00" read like a struck-through
              compare-at price (QA card 304). Match the PDP wording. */}
          {price !== 0 && Number(installationCost) > 0 && (
            <span className={styles.installationCost}>
              + {formatPrice(installationCost)} for installation
            </span>
          )}
        </div>
      )}
    </div>
  );
}
