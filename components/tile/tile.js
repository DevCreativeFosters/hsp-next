'use client';

import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import styles from './tile.module.scss';
import routes from '@lib/routes';

export default function Tile({
  title,
  content,
  createdAt,
  url,
  link,
  image,
  variant,
  className,
}) {
  const postUrl = url || link?.url || '';
  const segments = postUrl.split('/').filter(Boolean);
  const slug = segments.pop();

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
    year: 'numeric',
    month: 'long', // do not use 'medium' as it is returning inconsistent strings server- vs client-side
  });

  const imageWidth = image?.mediaDetails?.width;
  const imageHeight = image?.mediaDetails?.height;
  const imageAspectRatio = imageHeight ? imageWidth / imageHeight : 1;

  const renderLink = useCallback(
    children => (
      <Link
        href={urlNormalized}
        className={styles.link}
        target={link?.target || null}
      >
        {children}
      </Link>
    ),
    [urlNormalized, link],
  );

  const TheImage = useMemo(
    () =>
      image?.sourceUrl ? (
        <Image
          className={styles.image}
          src={image.sourceUrl}
          alt={image?.altText || ''}
          fill={true}
        />
      ) : (
        <span className={styles.imagePlaceholder} />
      ),
    [image],
  );

  const Title = useMemo(
    () => <h2 className={styles.title}>{title}</h2>,
    [title],
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
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
