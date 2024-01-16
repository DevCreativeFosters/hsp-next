import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@components/lifestyle/featured-article.module.scss';

export default function FeaturedArticle({
  title,
  content,
  createdAt,
  url,
  image,
}) {
  const createdAtHuman = new Date(createdAt).toLocaleString('en-AU', {
    year: 'numeric',
    month: 'long',
  });

  const imageWidth = image?.mediaDetails.width;
  const imageHeight = image?.mediaDetails.height;
  const imageAspectRatio = imageHeight ? imageWidth / imageHeight : 1;

  const TheImage = useMemo(
    () =>
      image ? (
        <Image
          className={styles.image}
          src={image?.sourceUrl}
          alt={image?.altText || ''}
          fill={true}
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
