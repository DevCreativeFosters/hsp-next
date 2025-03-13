import clsx from 'clsx';
import Image from 'next/image';

import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './card.module.scss';

export default function Card({
  backgroundImage,
  description,
  icon,
  title,
  titleTag,
  titleTagStyle,
}) {
  return (
    <div className={styles.card}>
      {icon && (
        <Image
          alt={icon?.altText}
          className={styles.icon}
          height={58}
          src={icon?.sourceUrl}
          width={58}
        />
      )}
      {title && (
        <DynamicTitle
          className={styles.title}
          defaultTag="h3"
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
        >
          {title}
        </DynamicTitle>
      )}
      {description && (
        <div
          className={clsx(styles.description, 'p-medium')}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      {backgroundImage && (
        <div className={styles.imageContainer}>
          <Image
            alt={backgroundImage?.sourceUrl}
            className={styles.image}
            height={169}
            src={backgroundImage?.sourceUrl}
            width={636}
          />
        </div>
      )}
    </div>
  );
}
