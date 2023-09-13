import Image from 'next/image';
import styles from './card.module.scss';

export default function Card({ title, description, icon, backgroundImage }) {
  return (
    <div className={styles.card}>
      {icon && (
        <Image
          className={styles.icon}
          src={icon?.sourceUrl}
          width={58}
          height={58}
          alt={icon?.altText}
        />
      )}
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && (
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      {backgroundImage && (
        <div className={styles.imageContainer}>
          <Image
            className={styles.image}
            src={backgroundImage?.sourceUrl}
            width={636}
            height={169}
            alt={backgroundImage?.sourceUrl}
          />
        </div>
      )}
    </div>
  );
}
