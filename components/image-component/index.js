'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { makeRelativeUrl } from '@lib/helpers';

import Container from '@components/container/container';

import styles from './image-component.module.scss';

export default function ImageComponent({ desktopImage, link, mobileImage }) {
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

  const images = (
    <>
      {renderImage(
        desktopImage,
        clsx(styles.desktopImage, { [styles.hideOnMobile]: mobileImage }),
      )}
      {renderImage(mobileImage, styles.mobileImage)}
    </>
  );

  const linkUrl = link?.url ? makeRelativeUrl(link.url) : null;

  return (
    <Container className={styles.container}>
      {linkUrl ? (
        <Link
          aria-label={link?.title || undefined}
          href={linkUrl}
          target={link?.target || undefined}
        >
          {images}
        </Link>
      ) : (
        images
      )}
    </Container>
  );
}
