import Container from '@components/container/container';
import Certification from './certification';
import styles from './accreditations.module.scss';

export default function Accreditations({
  title,
  description,
  certificates,
  group,
}) {
  return (
    <Container>
      <div className={styles.wrapper}>
        <div className={styles.intro}>
          {title && <h2 className={styles.title}>{title}</h2>}
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
                key={certification.certificateName + idx}
                name={certification.certificateName}
                image={certification.image}
              />
            ))}
          </div>
        )}

        {group && (
          <div className={styles.info}>
            <h3 className={styles.heading}>{group.title}</h3>
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
