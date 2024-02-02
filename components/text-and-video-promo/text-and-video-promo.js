import Container from '@components/container/container';
import Button from '@components/button/button';
import TextElement from '@components/text-element/text-element';
import VideoCard from '@components/video-card/video-card';

import styles from './text-and-video-promo.module.scss';

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
          {title && (
            <h2 className={styles.title}>
              <TextElement text={title} />
            </h2>
          )}
          {description && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          {linkUrl && linkText && (
            <Button className={styles.moreButton} size="large" href={linkUrl}>
              {linkText}
            </Button>
          )}
        </div>
        {videoUrl && (
          <div className={styles.video}>
            <VideoCard variant="rectangle" url={videoUrl} />
          </div>
        )}
      </div>
    </Container>
  );
}
