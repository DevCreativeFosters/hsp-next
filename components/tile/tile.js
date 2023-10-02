'use client';

import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import normalizeTag from '@lib/normalize-tag';
import styles from './tile.module.scss';

export default function Tile({
  title,
  content,
  createdAt,
  url,
  link,
  tags,
  image,
  variant,
}) {
  const urlNormalized = url || link?.url;
  const tileClassNames = clsx(styles.container, {
    [styles.blog]: variant === 'blog',
  });

  const createdAtHuman = new Date(createdAt).toLocaleString('en-AU', {
    dateStyle: 'medium',
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
    [urlNormalized],
  );

  const TheImage = useMemo(
    () =>
      image ? (
        <Image
          className={styles.image}
          src={image?.sourceUrl}
          alt={image?.altText}
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

  const tagsNormalized = tags.map(normalizeTag).filter(Boolean);

  return (
    <article className={tileClassNames}>
      <div
        className={styles.imageContainer}
        style={{ '--aspect-ratio': imageAspectRatio }}
      >
        {urlNormalized ? renderLink(TheImage) : TheImage}

        {tagsNormalized.length > 0 && (
          <ul className={styles.tagList}>
            {tagsNormalized.map(({ name, link }, index) => (
              <li key={index}>
                <Link className={styles.tag} href={link.url || ''}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        )}
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
