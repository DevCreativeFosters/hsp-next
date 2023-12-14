import clsx from 'clsx';
import TextElement from '@components/text-element/text-element';
import styles from './section-intro.module.scss';

export default function SectionIntro({
  title,
  description = null,
  fitInline,
  narrowDescription,
  children,
}) {
  return (
    <div
      className={clsx(styles.container, {
        [styles.fitInline]: fitInline,
        [styles.narrowDescription]: narrowDescription,
      })}
    >
      <h2 className={styles.title}>{title}</h2>
      <TextElement className={styles.description} text={description} />
      {children}
    </div>
  );
}
