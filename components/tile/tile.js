'use client';

import React, { useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './tile.module.scss';

export default function Tile({ title, content, createdAt, url, tags, image }) {
  const createdAtHuman = new Date(createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
  });

  const imageAspectRatio = image.obj.width / image.obj.height;

  const renderLink = useCallback(
    children => (
      <Link href={url} className={styles.link}>
        {children}
      </Link>
    ),
    [url],
  );

  const TheImage = useMemo(
    () => (
      <Image
        className={styles.image}
        src={image.obj.src}
        alt={image.alt}
        fill={true}
      />
    ),
    [image],
  );

  const Title = useMemo(
    () => <h2 className={styles.title}>{title}</h2>,
    [title],
  );

  return (
    <article className={styles.container}>
      <div
        className={styles.imageContainer}
        style={{ '--aspect-ratio': imageAspectRatio }}
      >
        {url ? renderLink(TheImage) : TheImage}

        {tags.length > 0 && (
          <ul className={styles.tagList}>
            {tags.map((tag, index) => (
              <li key={index}>
                <a className={styles.tag} href="#">
                  {tag}
                </a>
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

        {url ? renderLink(Title) : Title}
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
