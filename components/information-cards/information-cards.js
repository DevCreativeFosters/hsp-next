import TextElement from '@components/text-element/text-element';
import clsx from 'clsx';
import Image from 'next/image';
import Container from '@components/container/container';
import styles from './information-cards.module.scss';

export default function InformationCards({ cards }) {
  return (
    <Container>
      <div className={styles.cards}>
        {cards.map(
          ({ backgroundImage, size, icon, title, gap, description }, index) => {
            const arr = gap > 0 ? new Array(gap).fill(<br />) : [];
            const gapFragment = arr.map(el => el);
            return (
              <div
                key={index}
                className={clsx(styles.card, {
                  [styles.minor]: size === 'minor',
                  [styles.major]: size === 'major',
                })}
              >
                {backgroundImage && (
                  <div className={styles.backgroundContainer}>
                    <Image
                      className={styles.backgroundImage}
                      src={backgroundImage.sourceUrl}
                      alt={backgroundImage.altText}
                      fill={true}
                    />
                    <div className={styles.backgroundGradient} />
                  </div>
                )}
                {icon && (
                  <div className={styles.iconContainer}>
                    <Image
                      src={icon?.sourceUrl}
                      alt={icon?.altText}
                      fill={true}
                    />
                  </div>
                )}
                {title && <h3 className={styles.title}>{title}</h3>}
                <div className={styles.spacer} />
                {gap > 0 && <div className={styles.gap}>{gapFragment}</div>}

                <TextElement
                  className={styles.description}
                  text={description}
                />
              </div>
            );
          },
        )}
      </div>
    </Container>
  );
}
