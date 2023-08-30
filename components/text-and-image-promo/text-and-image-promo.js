import Container from '@components/container/container';
import Button from '@components/button';
import VideoCard from '@components/video-card/video-card';

import styles from './text-and-image-promo.module.scss';

export default function TextAndImagePromo({
  title,
  description,
  videoUrl,
  linkText,
  linkUrl,
}) {
  return (
    <Container>
      <div className={styles.promo}>
        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <Button
            size="large"
            href={linkUrl}
            style={{ maxWidth: 'fit-content' }}
          >
            {linkText}
          </Button>
        </div>
        <div className={styles.video}>
          <VideoCard variant="square" url={videoUrl} />
        </div>
      </div>
    </Container>
  );
}
