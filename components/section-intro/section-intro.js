import clsx from 'clsx';

import TextElement from '@components/text-element/text-element';

import styles from './section-intro.module.scss';

export default function SectionIntro({
  children,
  description = null,
  fitInline,
  narrowDescription,
  noBottomMargin,
  noMargin,
  noTopMargin,
  title,
}) {
  return (
    <div
      className={clsx(styles.container, {
        [styles.fitInline]: fitInline,
        [styles.noChildren]: !children,
        [styles.narrowDescription]: narrowDescription,
        [styles.noTopMargin]: noTopMargin,
        [styles.noBottomMargin]: noBottomMargin,
        [styles.noMargin]: noMargin,
      })}
    >
      {title && <h2 className={styles.title}>{title}</h2>}
      {description && (
        <TextElement className={styles.description} text={description} />
      )}
      {children}
    </div>
  );
}
