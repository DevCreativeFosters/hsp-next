import Image from 'next/image';

import styles from './store-category.module.scss';

export default function StoreCategory({ color, icon, label }) {
  if (!label) return null;

  return (
    <div className={styles.typeContainer}>
      {icon && (
        <div className={styles.imageWrapper}>
          <Image
            alt={label}
            className={styles.image}
            height={193}
            src={icon}
            width={193}
          />
        </div>
      )}
      <p
        className={styles.storeTypeLabel}
        style={{
          color: color || '#fff',
        }}
      >
        {label}
      </p>
    </div>
  );
}
