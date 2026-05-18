import { makeRelativeUrl } from '@lib/helpers';

import Button from '@components/button/button';
import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './promos-with-two-videos.module.scss';
import VideoCard from './video-card';

export default function PromoWithTwoVideos({ data }) {
  const {
    accessories,
    buttonLink,
    description,
    sectionTitle,
    titleTag,
    titleTagStyle,
  } = data;

  return (
    <Container>
      {sectionTitle && (
        <DynamicTitle
          className={styles.title}
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
        >
          {sectionTitle}
        </DynamicTitle>
      )}
      <div className={styles.informationSection}>
        {description && (
          <div className={styles.mainInfo}>
            {description && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
            {buttonLink && (
              <Button
                href={makeRelativeUrl(buttonLink.url) || ''}
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
                idx={idx}
                key={idx}
                name={accessory?.accessoryName}
                price={accessory?.price}
                productUrl={accessory?.productLink?.url}
                titleTag={accessory?.titleTag}
                titleTagStyle={accessory?.titleTagStyle}
                url={accessory?.videoFile?.node?.mediaItemUrl}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
