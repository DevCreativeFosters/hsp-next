'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '@lib/helpers';

import styles from './product-item.module.scss';

export default function ProductItem({
  category,
  className,
  imageUrl,
  name,
  price,
  url = '',
}) {
  const LinkOrDiv = url ? Link : 'div';
  return (
    <LinkOrDiv className={clsx(styles.product, className)} href={url}>
      <div className={styles.imageContainer}>
        {imageUrl && (
          <Image
            alt={name}
            className={styles.image}
            fill={true}
            src={imageUrl}
          />
        )}
      </div>
      {name && <div className={clsx(styles.name, 'h5')}>{name}</div>}
      {category && <div className={styles.name}>{category}</div>}
      {(price || price === 0) && (
        <div className={styles.price}>from {formatPrice(price)}</div>
      )}
    </LinkOrDiv>
  );
}
