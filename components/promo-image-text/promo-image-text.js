'use client';

import Image from 'next/image';

import { useIsMediumWidth } from '@hooks/useIsMediumWidth';
import { useIsMobile } from '@hooks/useIsMobile';

import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './promo-image-text.module.scss';

export default function PromoImageText({
  description,
  image,
  title,
  titleTag,
  titleTagStyle,
}) {
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
          {title && (
            <DynamicTitle
              className={styles.title}
              titleTag={titleTag}
              titleTagStyle={titleTagStyle}
            >
              {title}
            </DynamicTitle>
          )}
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </Container>
  );
}
