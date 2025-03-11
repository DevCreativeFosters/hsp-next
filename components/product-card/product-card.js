'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '@lib/helpers';

import styles from './product-card.module.scss';

export default function ProductCard({
  imageUrl,
  name,
  price,
  removeBorder = false,
  url = '',
}) {
  const LinkOrDiv = url ? Link : 'div';

  return (
    <LinkOrDiv
      className={clsx(styles.product, removeBorder ? styles.removeBorder : '')}
      href={url}
    >
      {imageUrl && (
        <Image
          alt={name}
          className={styles.image}
          height={160}
          src={imageUrl}
          width={230}
        />
      )}
      {name && <div className={clsx(styles.name, 'h5')}>{name}</div>}
      {(price || price === 0) && (
        <div className={clsx(styles.price, 'p-small')}>
          from {formatPrice(price)}
        </div>
      )}
    </LinkOrDiv>
  );
}
