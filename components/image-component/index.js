'use client';

import clsx from 'clsx';
import Image from 'next/image';

import Container from '@components/container/container';

import styles from './image-component.module.scss';

export default function ImageComponent({ desktopImage, mobileImage }) {
  const renderImage = (image, additionalClass) => {
    if (!image?.node?.mediaDetails || !image.node.sourceUrl) {
      return null;
    }

    const { height, width } = image.node.mediaDetails;

    return (
      <Image
        alt={image.node.altText ?? 'Image'}
        className={additionalClass}
        height={height}
        src={image.node.sourceUrl}
        width={width}
      />
    );
  };

  return (
    <Container className={styles.container}>
      {renderImage(
        desktopImage,
        clsx(styles.desktopImage, { [styles.hideOnMobile]: mobileImage }),
      )}
      {renderImage(mobileImage, styles.mobileImage)}
    </Container>
  );
}
