import clsx from 'clsx';

import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './feature.module.scss';

export default function Feature({
  description,
  index,
  style,
  title,
  titleTag,
  titleTagStyle,
}) {
  return (
    <div
      className={clsx(styles.featureTile, styles[`f${index + 1}`])}
      style={style}
    >
      {title && (
        <DynamicTitle
          defaultTag="h3"
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
        >
          {title}
        </DynamicTitle>
      )}
      {description && (
        <div
          className={clsx(styles.featureDescription, 'p-large')}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
}
