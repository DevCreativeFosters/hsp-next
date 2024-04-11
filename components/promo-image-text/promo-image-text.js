'use client';

import Image from 'next/image';

import { useIsMediumWidth } from '@hooks/useIsMediumWidth';
import { useIsMobile } from '@hooks/useIsMobile';

import Container from '@components/container/container';

import styles from './promo-image-text.module.scss';

export default function PromoImageText({ description, image, title }) {
  const isMobile = useIsMobile();
  const isMediumWidth = useIsMediumWidth();
  return (
    <Container>
      <div className={styles.promo}>
        <div className={styles.imageContainer}>
          <Image
            alt={image?.altText || ''}
            className={styles.image}
            height={isMobile ? 293 : isMediumWidth ? 435 : 750}
            src={image?.sourceUrl}
            width={isMobile ? 342 : isMediumWidth ? 342 : 634}
          />
        </div>
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </Container>
  );
}
