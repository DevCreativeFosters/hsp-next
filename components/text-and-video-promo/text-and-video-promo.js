import clsx from 'clsx';

import Button from '@components/button/button';
import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';
import TextElement from '@components/text-element/text-element';
import VideoCard from '@components/video-card/video-card';

import styles from './text-and-video-promo.module.scss';

export default function TextAndImagePromo({
  description,
  linkText,
  linkUrl = '',
  title,
  titleTag,
  titleTagStyle,
  videoUrl,
}) {
  return (
    <Container flexibleBlockPadding>
      <div className={styles.promo}>
        <div className={styles.text}>
          {title && (
            <DynamicTitle
              className={styles.title}
              titleTag={titleTag}
              titleTagStyle={titleTagStyle}
            >
              <TextElement text={title} />
            </DynamicTitle>
          )}
          {description && (
            <div
              className={clsx(styles.description, 'p-large')}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          {linkUrl && linkText && (
            <Button className={styles.moreButton} href={linkUrl} size="large">
              {linkText}
            </Button>
          )}
        </div>
        {videoUrl && (
          <div className={styles.video}>
            <VideoCard url={videoUrl} variant="rectangle" />
          </div>
        )}
      </div>
    </Container>
  );
}
