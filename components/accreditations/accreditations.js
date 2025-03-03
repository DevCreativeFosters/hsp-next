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
    <Container>
      <div className={styles.wrapper}>
        <div className={styles.intro}>
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
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

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
                className={styles.heading}
                defaultTag="h3"
                titleTag={group.titleTag}
                titleTagStyle={group.titleTagStyle}
              >
                {group.title}
              </DynamicTitle>
            )}
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: group.text }}
            />
          </div>
        )}
      </div>
    </Container>
  );
}
