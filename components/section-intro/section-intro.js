import clsx from 'clsx';

import DynamicTitle from '@components/dynamic-title/dynamic-title';
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
  titleTag,
  titleTagStyle,
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
      {title && (
        <DynamicTitle
          className={styles.title}
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
        >
          {title}
        </DynamicTitle>
      )}
      {description && (
        <TextElement className={clsx(styles.description, 'p-large')} text={description} />
      )}
      {children}
    </div>
  );
}
