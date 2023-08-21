import Button from '@components/button';
import { features as featuresMockup } from '@mockup/features';

import styles from './features.module.scss';

export default function Features({ exampleVideoUrl }) {
  const {
    title: leadingTitle,
    description: leadingDescription,
    cta,
    video,
    features,
  } = featuresMockup;

  if (!video.src) {
    video.src = exampleVideoUrl;
  }

  return (
    <div className={styles.container}>
      <div className={styles.leadingFeature}>
        {leadingTitle && (
          <h2 className={styles.leadingTitle}>{leadingTitle}</h2>
        )}
        {leadingDescription && (
          <div
            className={styles.leadingDescription}
            dangerouslySetInnerHTML={{ __html: leadingDescription }}
          />
        )}
        {cta && (
          <Button href={cta.url} size="large">
            {cta.label}
          </Button>
        )}
      </div>
      {features.length > 0 && (
        <div className={styles.features}>
          {video?.src && (
            <div className={styles.videoTile}>
              <video className={styles.video} loop autoPlay muted>
                <source src={video.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {features.map(({ title, description }, index) => (
            <div
              className={styles.featureTile}
              key={index}
              style={{ order: (index + 1) * 10 }}
            >
              {title && <h3 className={styles.featureTitle}>{title}</h3>}
              {description && (
                <div
                  className={styles.featureDescription}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
