'use client';

import Image from 'next/image';

import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';
import ContentBox from '@components/content-box/content-box';

import styles from './choose-your-vehicle-block-preview.module.scss';

export default function ChooseYourVehicleBlockPreview({
  category,
  description,
  image,
  make,
  model,
  onEnquire,
  price,
}) {
  return (
    <div className={styles.wrapper}>
      {image && (
        <div className={styles.image}>
          <Image
            alt={image.alt || 'Vehicle Preview'}
            height={image.height}
            src={image.url}
            width={image.width}
          />
        </div>
      )}

      <div className={styles.details}>
        <h1 className={styles.name}>
          {category} <br />
          <span className={styles.variant}>
            {make} {model}
          </span>
        </h1>

        {description && <p className={styles.description}>{description}</p>}

        {price && price > 0 && (
          <ContentBox className={styles.productsPrice}>
            <span className={styles.price}>{formatPrice(price)}</span>
            <span className={styles.installationPrice}>
              <span> + installation costs </span>
            </span>
          </ContentBox>
        )}

        <Button className={styles.button} onClick={onEnquire} size="large">
          Go to product details page
        </Button>
      </div>
    </div>
  );
}
