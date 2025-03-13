'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '@lib/helpers';

import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './product-card.module.scss';

export default function ProductCard({
  imageUrl,
  name,
  price,
  removeBorder = false,
  titleTag,
  titleTagStyle,
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
      {name && (
        <DynamicTitle
          className={styles.name}
          defaultTag="h5"
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
        >
          {name}
        </DynamicTitle>
      )}
      {(price || price === 0) && (
        <div className={clsx(styles.price, 'p-small')}>
          from {formatPrice(price)}
        </div>
      )}
    </LinkOrDiv>
  );
}
