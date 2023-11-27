'use client';

import { useRef } from 'react';
import usePlaybackOnScroll from '@hooks/usePlaybackOnScroll';
import { useIsMobile } from '@hooks/useIsMobile';
import Tag from '@components/tag/tag';
import Button from '@components/button/button';
import Container from '@components/container/container';
import styles from './featured-post.module.scss';

export default function FeaturedPost({
  title,
  excerpt,
  uri,
  video,
  youtubeId,
  tags,
  date,
  postType,
}) {
  const isMobile = useIsMobile();
  const videoRef = useRef(null);

  const tagList = tags?.nodes;
  const sortedTagList = [...tagList].sort((a, b) => {
    if (a.name === postType) {
      return -1;
    } else if (b.name === postType) {
      return 1;
    }
    return 0;
  });

  const formattedDate = new Date(date).toLocaleString('en-AU', {
    dateStyle: 'short',
  });

  usePlaybackOnScroll(videoRef);

  return (
    <div className={styles.featuredPost}>
      {video && (
        <video className={styles.video} ref={videoRef} loop muted>
          <source src={video.mediaItemUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      <div className={styles.backgroundGradient} />
      <Container>
        <div className={styles.information}>
          {sortedTagList && (
            <div className={styles.tags}>
              {sortedTagList.map((tag, idx) => {
                return (
                  <Tag
                    key={tag?.name + idx}
                    name={tag.name}
                    variant={tag?.name === postType && !isMobile && 'primary'}
                  />
                );
              })}
            </div>
          )}
          {isMobile && <span className={styles.date}>{formattedDate}</span>}
          {title && <h1 className={styles.title}>{title}</h1>}
          {excerpt && (
            <div
              className={styles.excerpt}
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
          )}
          {(youtubeId || uri) && (
            <div className={styles.buttons}>
              {youtubeId && (
                <Button
                  onToggleIconClick={() => null} // WIP - add video modal popup functionality
                  variant="primary"
                  size="large"
                  rightIcon="play-button"
                >
                  Watch video
                </Button>
              )}
              {uri && (
                <Button href={uri} variant="secondary" size="large">
                  Read more
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
