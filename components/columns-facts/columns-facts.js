'use client';

import clsx from 'clsx';
import Image from 'next/image';

import { useIsMediumWidth } from '@hooks/useIsMediumWidth';
import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import Container from '@components/container/container';
import TextElement from '@components/text-element/text-element';
import VideoCard from '@components/video-card/video-card';

import styles from './columns-facts.module.scss';

export default function ColumnsFacts({
  alignment,
  columns,
  image,
  media,
  title,
  videoFile,
}) {
  const isMobile = useIsMobile();
  const isMediumWidth = useIsMediumWidth();

  return (
    <Container className={styles.container}>
      {title && (
        <h2
          className={clsx(styles.title, styles[alignment] || styles.left)}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}

      <div className={styles.media}>
        {media === 'image' && image && (
          <Image
            alt={image?.node?.altText || ''}
            className={styles.image}
            height={isMobile ? 197 : isMediumWidth ? 471 : 942}
            src={image?.node?.sourceUrl}
            width={isMobile ? 342 : isMediumWidth ? 660 : 1320}
          />
        )}
        {media === 'video' && videoFile && (
          <div className={styles.video}>
            <VideoCard url={videoFile?.node?.mediaItemUrl} />
          </div>
        )}
      </div>

      <div className={styles.columns}>
        {columns.map((column, index) => (
          <div className={styles.column} key={index}>
            {column.description && (
              <TextElement
                className={styles.description}
                text={column.description}
              />
            )}
            {column.ctaButton && (
              <Button
                className={styles.button}
                href={column.ctaButton.url}
                size="large"
                target={column.ctaButton?.target || 'self'}
              >
                {column.ctaButton.title}
              </Button>
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}
