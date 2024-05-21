import clsx from 'clsx';
import Image from 'next/image';

import Container from '@components/container/container';
import TextElement from '@components/text-element/text-element';

import styles from './information-cards.module.scss';

export default function InformationCards({ cards }) {
  return (
    <Container>
      <div className={styles.cards}>
        {cards.map(
          ({ backgroundImage, description, gap, icon, size, title }, index) => {
            const arr = gap > 0 ? new Array(gap).fill(<br />) : [];
            const gapFragment = arr.map(el => el);
            return (
              <div
                className={clsx(styles.card, {
                  [styles.minor]: size[0] === 'minor',
                  [styles.major]: size[0] === 'major',
                })}
                key={index}
              >
                {backgroundImage && (
                  <div className={styles.backgroundContainer}>
                    <Image
                      alt={backgroundImage.node?.altText}
                      className={styles.backgroundImage}
                      fill={true}
                      src={backgroundImage.node?.sourceUrl}
                    />
                    <div className={styles.backgroundGradient} />
                  </div>
                )}
                {icon && (
                  <div className={styles.iconContainer}>
                    <Image
                      alt={icon?.node?.altText}
                      fill={true}
                      src={icon?.node?.sourceUrl}
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
