'use client';

import clsx from 'clsx';
import Image from 'next/image';

import { useIsMediumWidth } from '@hooks/useIsMediumWidth';
import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import Container from '@components/container/container';
import TextElement from '@components/text-element/text-element';
import VideoCard from '@components/video-card/video-card';

import styles from './image-text-boxes.module.scss';

export default function ImageTextBoxes({ boxes }) {
  const isMobile = useIsMobile();
  const isMediumWidth = useIsMediumWidth();

  console.log(boxes);

  if (!boxes || boxes.length === 0) return null;

  return (
    <Container className={styles.container}>
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
            {box.title && <h2 className={styles.title}>{box.title}</h2>}
            {box.description && (
              <TextElement
                className={styles.description}
                text={box.description}
              />
            )}
          </div>
        </div>
      ))}
    </Container>
  );
}
