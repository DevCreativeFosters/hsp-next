'use client';

import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '@lib/helpers';

import styles from './product-card.module.scss';

export default function ProductCard({ imageUrl, name, price, url = '' }) {
  const LinkOrDiv = url ? Link : 'div';

  return (
    <LinkOrDiv className={styles.product} href={url}>
      {imageUrl && (
        <Image
          alt={name}
          className={styles.image}
          height={160}
          src={imageUrl}
          width={230}
        />
      )}
      {name && <div className={styles.name}>{name}</div>}
      {(price || price === 0) && (
        <div className={styles.price}>from {formatPrice(price)}</div>
      )}
    </LinkOrDiv>
  );
}
