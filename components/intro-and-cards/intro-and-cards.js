import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import Card from './card';
import styles from './intro-and-cards.module.scss';

export default function IntroAndCards({
  cards,
  description,
  title,
  titleTag,
  titleTagStyle,
}) {
  return (
    <Container>
      <div className={styles.container}>
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
        {cards &&
          cards?.map((card, idx) => {
            return (
              <Card
                backgroundImage={card?.backgroundImage?.node}
                description={card?.description}
                icon={card?.image?.node}
                key={card?.title + idx}
                title={card?.title}
                titleTag={card?.titleTag}
                titleTagStyle={card?.titleTagStyle}
              />
            );
          })}
      </div>
    </Container>
  );
}
