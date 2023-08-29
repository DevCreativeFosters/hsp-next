import VideoCard from './video-card';
import Button from '@components/button';
import Container from '@components/container/container';
import styles from './promos-with-two-videos.module.scss';

export default function PromoWithTwoVideos({ data }) {
  const { sectionTitle, description, buttonLink, accessories } = data;

  return (
    <Container>
      {sectionTitle && <h2 className={styles.title}>{sectionTitle}</h2>}
      <div className={styles.informationSection}>
        {description && (
          <div className={styles.mainInfo}>
            <p className={styles.description}>{description}</p>
            {buttonLink && (
              <Button
                href={buttonLink.url}
                rightIcon="arrow-forward"
                size="large"
                style={{ maxWidth: 'fit-content' }}
              >
                {buttonLink.title}
              </Button>
            )}
          </div>
        )}
        {accessories && (
          <div className={styles.cards}>
            {accessories.map((accessory, idx) => (
              <VideoCard
                key={idx}
                idx={idx}
                url={accessory?.videoUrl}
                name={accessory?.accessoryName}
                price={accessory?.price}
                productUrl={accessory?.productLink?.url}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
