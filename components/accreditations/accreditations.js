import clsx from 'clsx';

import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './accreditations.module.scss';
import Certification from './certification';

export default function Accreditations({
  certificates,
  description,
  group,
  title,
  titleTag,
  titleTagStyle,
}) {
  return (
    <Container flexibleBlockPadding>
      <div className={styles.wrapper}>
        <div className={styles.intro}>
          {title && (
            <DynamicTitle
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
        </div>

        <div className={styles.certificatesWrapper}>
          {certificates.length > 0 && (
            <div className={styles.certificates}>
              {certificates.map((certification, idx) => (
                <Certification
                  image={certification.image?.node}
                  key={certification.certificateName + idx}
                  name={certification.certificateName}
                />
              ))}
            </div>
          )}

          {group && (
            <div className={styles.info}>
              {group.title && (
                <DynamicTitle
                  defaultTag="h3"
                  titleTag={group.titleTag}
                  titleTagStyle={group.titleTagStyle}
                >
                  {group.title}
                </DynamicTitle>
              )}
              <div
                className={clsx(styles.content, 'p-medium')}
                dangerouslySetInnerHTML={{ __html: group.text }}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
