'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@lib/helpers';

import styles from './product-item.module.scss';

export default function ProductItem({ name, imageUrl, url = '', price }) {
  const LinkOrDiv = url ? Link : 'div';
  return (
    <LinkOrDiv href={url} className={styles.product}>
      <div className={styles.imageContainer}>
        {imageUrl && (
          <Image
            className={styles.image}
            src={imageUrl}
            alt={name}
            fill={true}
          />
        )}
      </div>
      {name && <div className={styles.name}>{name}</div>}
      {(price || price === 0) && (
        <div className={styles.price}>from {formatPrice(price)}</div>
      )}
    </LinkOrDiv>
  );
}
