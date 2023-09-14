import Image from 'next/image';
import styles from './certification.module.scss';

export default function Certification({ name, image }) {
  return (
    <div className={styles.certification}>
      {image && (
        <div className={styles.imageContainer}>
          <Image
            className={styles.image}
            src={image.sourceUrl}
            width={200}
            height={185}
            alt={image.altText}
          />
        </div>
      )}
      {name && (
        <div>
          <span className={styles.name}>{name}</span>
          <span className={styles.label}>certificate</span>
        </div>
      )}
    </div>
  );
}
