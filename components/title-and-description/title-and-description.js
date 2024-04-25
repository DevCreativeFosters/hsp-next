import clsx from 'clsx';

import styles from './title-and-description.module.scss';

export default function TitleAndDescription({
  description,
  layoutVariant,
  title,
}) {
  if (title || description) {
    return (
      <section
        className={clsx(styles.section, layoutVariant && styles[layoutVariant])}
      >
        {title && <h1 className={styles.title}>{title}</h1>}
        {description && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </section>
    );
  }
  return null;
}
