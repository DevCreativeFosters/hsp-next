import { useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import styles from '@components/lifestyle/featured-article.module.scss';

export default function FeaturedArticle({
  content,
  createdAt,
  image,
  title,
  url,
}) {
  const createdAtHuman = new Date(createdAt).toLocaleString('en-AU', {
    month: 'long',
    year: 'numeric',
  });

  const imageWidth = image?.mediaDetails.width;
  const imageHeight = image?.mediaDetails.height;
  const imageAspectRatio = imageHeight ? imageWidth / imageHeight : 1;

  const TheImage = useMemo(
    () =>
      image ? (
        <Image
          alt={image?.altText || ''}
          className={styles.image}
          fill={true}
          src={image?.sourceUrl}
        />
      ) : (
        <span className={styles.imagePlaceholder} />
      ),
    [image],
  );

  return (
    <article className={styles.container}>
      <div className={styles.info}>
        <time className={styles.date} dateTime={createdAt}>
          {createdAtHuman}
        </time>

        <Link className={styles.link} href={url || ''}>
          <h2 className={styles.title}>{title}</h2>
        </Link>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </div>
      <div
        className={styles.imageContainer}
        style={{ '--aspect-ratio': imageAspectRatio }}
      >
        <Link className={styles.link} href={url || ''}>
          {TheImage}
        </Link>
      </div>
    </article>
  );
}
