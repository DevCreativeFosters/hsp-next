import Container from '@components/container/container';
import Card from './card';
import styles from './intro-and-cards.module.scss';

export default function IntroAndCards({ title, description, cards }) {
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
                key={card?.title + idx}
                title={card?.title}
                description={card?.description}
                icon={card?.image}
                backgroundImage={card?.backgroundImage}
              />
            );
          })}
      </div>
    </Container>
  );
}
