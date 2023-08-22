'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './article.module.scss';

export default function Article({
  title,
  content,
  createdAt,
  url,
  tags,
  image,
}) {
  const createdAtHuman = new Date(createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
  });

  const imageAspectRatio = image.obj.width / image.obj.height;

  return (
    <article className={styles.container}>
      <div
        className={styles.imageContainer}
        style={{ '--aspect-ratio': imageAspectRatio }}
      >
        <Link className={styles.link} href={url}>
          <Image
            className={styles.image}
            src={image.obj.src}
            alt={image.alt}
            fill={true}
          />
        </Link>
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
        <time className={styles.date} dateTime={createdAt}>
          {createdAtHuman}
        </time>
        <Link className={styles.link} href={url}>
          <h2 className={styles.title}>{title}</h2>
        </Link>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
