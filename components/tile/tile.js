'use client';

import { useCallback, useMemo } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import routes from '@lib/routes';

import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './tile.module.scss';

export default function Tile({
  className,
  content,
  createdAt,
  image,
  link,
  title,
  titleTag,
  titleTagStyle,
  url,
  variant,
}) {
  const postUrl = url || link?.url || '#';
  const segments = postUrl.split('/').filter(Boolean);
  const slug = segments.pop();
  const imageNormalized = image?.node ? image.node : image;

  const urlNormalized =
    variant === 'blog'
      ? routes.blog(slug)
      : variant === 'hsp-tv'
        ? routes.tv(slug)
        : postUrl;

  const tileClassNames = clsx(styles.container, {
    [styles.blog]: variant === 'blog' || variant === 'hsp-tv',
    [styles.carousel]: variant === 'carousel',
    [styles[className]]: className,
  });

  const createdAtHuman = new Date(createdAt).toLocaleString('en-AU', {
    month: 'long',
    year: 'numeric', // do not use 'medium' as it is returning inconsistent strings server- vs client-side
  });

  const imageWidth = imageNormalized?.width;
  const imageHeight = imageNormalized?.height;
  const imageAspectRatio = imageHeight ? imageWidth / imageHeight : 1;

  const renderLink = useCallback(
    children => (
      <Link
        className={styles.link}
        href={urlNormalized || ''}
        target={link?.target || null}
      >
        {children}
      </Link>
    ),
    [link, urlNormalized],
  );

  const TheImage = useMemo(
    () =>
      imageNormalized?.sourceUrl ? (
        <Image
          alt={imageNormalized.altText || ''}
          className={styles.image}
          fill={true}
          src={imageNormalized.sourceUrl}
        />
      ) : (
        <span className={styles.imagePlaceholder} />
      ),
    [imageNormalized],
  );

  const Title = useMemo(
    () => (
      <DynamicTitle
        className={clsx(styles.title, 'h4')}
        defaultTag="h2"
        titleTag={titleTag}
        titleTagStyle={titleTagStyle}
      >
        {title}
      </DynamicTitle>
    ),
    [title, titleTag, titleTagStyle],
  );

  return (
    <article className={tileClassNames}>
      <div
        className={styles.imageContainer}
        style={{ '--aspect-ratio': imageAspectRatio }}
      >
        {urlNormalized ? renderLink(TheImage) : TheImage}
      </div>
      <div className={styles.info}>
        {createdAt && (
          <time className={styles.date} dateTime={createdAt}>
            {createdAtHuman}
          </time>
        )}

        {urlNormalized ? renderLink(Title) : Title}
        <div
          className={clsx(styles.content, 'p-medium')}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
