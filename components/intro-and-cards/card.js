import Image from 'next/image';

import styles from './card.module.scss';

export default function Card({ backgroundImage, description, icon, title }) {
  return (
    <div className={styles.card}>
      {icon && (
        <Image
          alt={icon?.altText}
          className={styles.icon}
          height={58}
          src={icon?.sourceUrl}
          width={58}
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
            alt={backgroundImage?.sourceUrl}
            className={styles.image}
            height={169}
            src={backgroundImage?.sourceUrl}
            width={636}
          />
        </div>
      )}
    </div>
  );
}
