import clsx from 'clsx';
import Image from 'next/image';

import styles from './certification.module.scss';

export default function Certification({ image, name }) {
  return (
    <div className={styles.certification}>
      {image && (
        <Image
          alt={image.altText}
          className={styles.image}
          height={185}
          src={image.sourceUrl}
          width={200}
        />
      )}
      {name && (
        <div>
          <span className={clsx(styles.name, 'h4')}>{name}</span>
          <span className={clsx(styles.label, 'p-medium')}>certificate</span>
        </div>
      )}
    </div>
  );
}
