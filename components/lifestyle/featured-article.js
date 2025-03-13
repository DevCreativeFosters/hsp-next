import { useMemo } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import routes from '@lib/routes';

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
  const slug = url
    .split('/')
    .filter(slug => slug)
    .pop();
  const postUrl = routes.tv(slug);

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
        <time className={clsx(styles.date, 'p-small')} dateTime={createdAt}>
          {createdAtHuman}
        </time>

        <Link className={styles.link} href={postUrl || ''}>
          <h2 className={styles.title}>{title}</h2>
        </Link>
        <div
          className={clsx(styles.content, 'p-medium')}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </div>
      <div
        className={styles.imageContainer}
        style={{ '--aspect-ratio': imageAspectRatio }}
      >
        <Link className={styles.link} href={postUrl || ''}>
          {TheImage}
        </Link>
      </div>
    </article>
  );
}
