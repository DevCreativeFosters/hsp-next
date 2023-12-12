import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@components/lifestyle/featured-article.module.scss';

export default function FeaturedArticle({
  title,
  content,
  createdAt,
  url,
  tags,
  image,
}) {
  const createdAtHuman = new Date(createdAt).toLocaleString('en-AU', {
    dateStyle: 'long',
  });

  const tagsNormalized = tags?.map(({ name, link }) => ({
    name,
    link: {
      url: link?.url || link,
    },
  }));

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
        {tagsNormalized?.length > 0 && (
          <ul className={styles.tagList}>
            {tagsNormalized.map(({ name, link }, index) => (
              <li key={index}>
                <a className={styles.tag} href={link?.url || ''}>
                  {name}
                </a>
              </li>
            ))}
          </ul>
        )}

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
