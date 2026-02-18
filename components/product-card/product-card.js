'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import ProductArrow from '@assets/icons/arrow-forward.svg';

import styles from './product-card.module.scss';

export default function ProductCard({
  hasFilters = false,
  imageUrl,
  name,
  price,
  removeBorder = false,
  template = '',
  titleTag,
  titleTagStyle,
  url = '',
}) {
  const showViewProductBtn = template === 'showViewProductBtn';
  const LinkOrDiv = url && !showViewProductBtn ? Link : 'div';

  return (
    <LinkOrDiv
      className={clsx(styles.product, removeBorder ? styles.removeBorder : '', {
        [styles.hasFilters]: hasFilters,
        [styles.viewProductBtn]: showViewProductBtn,
      })}
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
      <div className={styles.productContent}>
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

        {showViewProductBtn && (
          <Button className={styles.button} href={url} variant="primary">
            View Product <ProductArrow />
          </Button>
        )}
      </div>
    </LinkOrDiv>
  );
}
