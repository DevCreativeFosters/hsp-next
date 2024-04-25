import Container from '@components/container/container';

import Card from './card';
import styles from './intro-and-cards.module.scss';

export default function IntroAndCards({ cards, description, title }) {
  return (
    <Container>
      <div className={styles.container}>
        <div className={styles.intro}>
          {title && <h2 className={styles.title}>{title}</h2>}
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
              />
            );
          })}
      </div>
    </Container>
  );
}
