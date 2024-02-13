import styles from './title-and-description.module.scss';
import clsx from 'clsx';

export default function TitleAndDescription({
  layoutVariant,
  title,
  description,
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
