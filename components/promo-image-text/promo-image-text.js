'use client';

import Image from 'next/image';
import { useIsMobile } from '@hooks/useIsMobile';
import { useIsMediumWidth } from '@hooks/useIsMediumWidth';
import Container from '@components/container/container';
import styles from './promo-image-text.module.scss';

export default function PromoImageText({ title, description, image }) {
  const isMobile = useIsMobile();
  const isMediumWidth = useIsMediumWidth();
  return (
    <Container>
      <div className={styles.promo}>
        <div className={styles.imageContainer}>
          <Image
            className={styles.image}
            src={image?.sourceUrl}
            alt={image?.altText}
            width={isMobile ? 342 : isMediumWidth ? 342 : 634}
            height={isMobile ? 293 : isMediumWidth ? 435 : 750}
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
