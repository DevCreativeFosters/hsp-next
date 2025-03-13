'use client';

import clsx from 'clsx';
import Image from 'next/image';

import { useIsMediumWidth } from '@hooks/useIsMediumWidth';
import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';
import TextElement from '@components/text-element/text-element';
import VideoCard from '@components/video-card/video-card';

import styles from './image-text-boxes.module.scss';

export default function ImageTextBoxes({ boxes }) {
  const isMobile = useIsMobile();
  const isMediumWidth = useIsMediumWidth();

  if (!boxes || boxes.length === 0) return null;

  return (
    <Container flexibleBlockPadding className={styles.container}>
      {boxes.map((box, index) => (
        <div className={clsx(styles.box, styles[box.layout])} key={index}>
          {box.media === 'image' && box.image && (
            <Image
              alt={box.image?.node?.altText || ''}
              className={styles.image}
              height={isMobile ? 192 : isMediumWidth ? 319 : 639}
              src={box.image?.node?.sourceUrl}
              width={isMobile ? 342 : isMediumWidth ? 564 : 1128}
            />
          )}
          {box.media === 'video' && box.videoFile && (
            <div className={styles.video}>
              <VideoCard url={box.videoFile?.node?.mediaItemUrl} />
            </div>
          )}
          <div className={styles.content}>
            {box.title && (
              <DynamicTitle
                className={styles.title}
                defaultTag="h2"
                titleTag={box.titleTag}
                titleTagStyle={box.titleTagStyle}
              >
                <span dangerouslySetInnerHTML={{ __html: box.title }} />
              </DynamicTitle>
            )}

            {box.description && (
              <TextElement
                className={clsx(styles.description, 'p-medium')}
                text={box.description}
              />
            )}

            {box.ctaButton && (
              <Button
                className={styles.button}
                href={box.ctaButton.url}
                size="large"
                target={box.ctaButton?.target || 'self'}
              >
                {box.ctaButton.title}
              </Button>
            )}
          </div>
        </div>
      ))}
    </Container>
  );
}
