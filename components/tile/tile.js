'use client';

import React, { useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './tile.module.scss';

export default function Tile({ title, content, createdAt, link, tags, image }) {
  const url = link?.url || link;
  const createdAtHuman = new Date(createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
  });

  const imageWidth = image?.mediaDetails.width;
  const imageHeight = image?.mediaDetails.height;
  const imageAspectRatio = imageHeight ? imageWidth / imageHeight : 1;

  const renderLink = useCallback(
    children => (
      <Link href={url} className={styles.link}>
        {children}
      </Link>
    ),
    [url],
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

  const tagsNormalized = tags.map(({ name, link }) => ({
    name,
    link: {
      url: link?.url || link,
    },
  }));

  return (
    <article className={styles.container}>
      <div
        className={styles.imageContainer}
        style={{ '--aspect-ratio': imageAspectRatio }}
      >
        {url ? renderLink(TheImage) : TheImage}

        {tagsNormalized.length > 0 && (
          <ul className={styles.tagList}>
            {tagsNormalized.map(({ name, link }, index) => {
              return (
                <li key={index}>
                  <a className={styles.tag} href={link.url}>
                    {name}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className={styles.info}>
        {createdAt && (
          <time className={styles.date} dateTime={createdAt}>
            {createdAtHuman}
          </time>
        )}

        {url ? renderLink(Title) : Title}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
