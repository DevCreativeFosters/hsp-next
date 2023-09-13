import clsx from 'clsx';
import TextElement from '@components/text-element/text-element';
import styles from './section-intro.module.scss';

export default function SectionIntro({
  title,
  description,
  fitInline,
  children,
}) {
  return (
    <div
      className={clsx(styles.container, fitInline ? styles.fitInline : null)}
    >
      <h2 className={styles.title}>{title}</h2>
      <TextElement className={styles.description} text={description} />
      {children}
    </div>
  );
}
