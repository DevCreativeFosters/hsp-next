import Image from 'next/image';
import styles from '@components/lifestyle/featured-article.module.scss';

export default function FeaturedArticle({
  title,
  content,
  createdAt,
  tags,
  image,
}) {
  const createdAtHuman = new Date(createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
  });

  const imageAspectRatio = image.obj.width / image.obj.height;

  return (
    <article className={styles.container}>
      <div className={styles.info}>
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

        <time className={styles.date} dateTime={createdAt}>
          {createdAtHuman}
        </time>

        <h2 className={styles.title}>{title}</h2>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <div
        className={styles.imageContainer}
        style={{ '--aspect-ratio': imageAspectRatio }}
      >
        <Image
          className={styles.image}
          src={image.obj.src}
          alt={image.alt}
          fill={true}
        />
      </div>
    </article>
  );
}
