import Image from 'next/image';

import styles from './certification.module.scss';

export default function Certification({ image, name }) {
  return (
    <div className={styles.certification}>
      {image && (
        <div className={styles.imageContainer}>
          <Image
            alt={image.altText}
            className={styles.image}
            height={185}
            src={image.sourceUrl}
            width={200}
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
