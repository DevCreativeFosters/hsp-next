import Image from 'next/image';
import { formatPrice } from '@lib/helpers';
import styles from './enquiry-product.module.scss';

export default function EnquiryProduct({
  imageUrl,
  name,
  price,
  installationCost,
}) {
  return (
    <div className={styles.product}>
      {imageUrl && (
        <Image
          className={styles.productImage}
          src={imageUrl}
          alt={`${name} image`}
          width={67}
          height={48}
        />
      )}
      {name && <p className={styles.name}>{name}</p>}
      {price && (
        <div className={styles.price}>
          {formatPrice(price)}{' '}
          <span className={styles.installationCost}>
            {' '}
            + {formatPrice(installationCost)}
          </span>
        </div>
      )}
    </div>
  );
}
