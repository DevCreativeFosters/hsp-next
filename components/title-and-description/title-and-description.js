import clsx from 'clsx';

import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './title-and-description.module.scss';

export default function TitleAndDescription({
  description,
  layoutVariant,
  title,
  titleTag,
  titleTagStyle,
}) {
  if (title || description) {
    return (
      <section
        className={clsx(styles.section, layoutVariant && styles[layoutVariant])}
      >
        {title && (
          <DynamicTitle
            className={styles.title}
            defaultTag="h1"
            titleTag={titleTag}
            titleTagStyle={titleTagStyle}
          >
            {title}
          </DynamicTitle>
        )}
        {description && (
          <div
            className={clsx(styles.description, 'p-large')}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </section>
    );
  }
  return null;
}
