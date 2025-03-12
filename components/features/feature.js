import clsx from 'clsx';

import styles from './feature.module.scss';

export default function Feature({ description, index, style, title }) {
  return (
    <div
      className={clsx(styles.featureTile, styles[`f${index + 1}`])}
      style={style}
    >
      {title && <h3 className={styles.featureTitle}>{title}</h3>}
      {description && (
        <div
          className={clsx(styles.featureDescription, 'p-large')}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}
