import { Fragment } from 'react';
import clsx from 'clsx';
import styles from './section-intro.module.scss';

export default function SectionIntro({
  title,
  description,
  fitInline,
  children,
}) {
  const lines = description.split('\r\n');
  const DescriptionBrokenLines = lines.map((line, index) => (
    <Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </Fragment>
  ));

  const descriptionNormalized = description.includes('</p>') ? (
    <div
      className={styles.description}
      dangerouslySetInnerHTML={{ __html: description }}
    />
  ) : (
    <div className={styles.description}>{DescriptionBrokenLines}</div>
  );

  return (
    <div
      className={clsx(styles.container, fitInline ? styles.fitInline : null)}
    >
      <h2 className={styles.title}>{title}</h2>
      {descriptionNormalized}
      {children}
    </div>
  );
}
