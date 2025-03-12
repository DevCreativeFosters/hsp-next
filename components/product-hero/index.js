import clsx from 'clsx';
import Image, { getImageProps } from 'next/image';

import styles from './product-hero.module.scss';

export default function ProductHero({
  customTitle,
  description,
  image,
  make,
  mobileImage,
  title,
}) {
  const slogan = make ? `for ${make}` : '100% Australian';
  const imageAlt = image?.node?.altText || title || customTitle;

  const desktopImageProps =
    image &&
    getImageProps({
      alt: imageAlt,
      height: 875,
      quality: 80,
      src: image.mediaItemUrl,
      width: 1440,
    });

  const mobileAlt = mobileImage?.node?.altText || imageAlt;

  const mobileImageProps =
    mobileImage &&
    getImageProps({
      alt: mobileAlt,
      height: 1334,
      quality: 70,
      src: mobileImage.mediaItemUrl,
      width: 750,
    });

  return (
    <div className={styles.hero}>
      <div className={styles.header}>
        {customTitle && (
          <h1 className={clsx(styles.title, 'h2')}>
            {customTitle.title}
            <span className={styles.slogan}>{customTitle.slogan}</span>
          </h1>
        )}
        {title && !customTitle && (
          <h1 className={clsx(styles.title, 'h2')}>
            {title}
            <span className={styles.slogan}>{slogan}</span>
          </h1>
        )}
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {image && (
        <figure className={styles.figure}>
          {mobileImage ? (
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet={desktopImageProps.props.srcSet}
              />
              <source srcSet={mobileImageProps.props.srcSet} />
              <img
                {...desktopImageProps.props}
                alt={mobileImage ? mobileAlt : imageAlt}
              />
            </picture>
          ) : (
            <Image alt={imageAlt} fill src={image.mediaItemUrl} />
          )}
        </figure>
      )}
    </div>
  );
}
