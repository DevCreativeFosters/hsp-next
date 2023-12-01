'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { POST_TYPES } from '@lib/post-types';
import routes from '@lib/routes';
import usePlaybackOnScroll from '@hooks/usePlaybackOnScroll';
import { useIsMobile } from '@hooks/useIsMobile';
import { VideoYoutube } from '@components/video-youtube/video-youtube';
import Tag from '@components/tag/tag';
import Button from '@components/button/button';
import Container from '@components/container/container';
import styles from './featured-post.module.scss';

export default function FeaturedPost({
  title,
  excerpt,
  video,
  youtubeId,
  slug,
  tags,
  date,
  postType,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoPreview = searchParams.get('videoPreview');
  const isMobile = useIsMobile();
  const videoRef = useRef(null);
  const [isPlayerActive, setIsPlayerActive] = useState(Boolean(videoPreview));

  let moreUrl;
  if (postType === POST_TYPES.TV) {
    moreUrl = routes.tv(slug);
  }

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

  const handleWatchVideoButtonClick = useCallback(() => {
    router.push(routes.lifestyleVideoPreview);
    setIsPlayerActive(true);
  }, [router]);

  const handleCloseVideo = useCallback(() => {
    setIsPlayerActive(false);
    if (videoPreview) {
      router.push(routes.lifestyle);
    }
  }, [videoPreview, router]);

  useEffect(
    function monitorRoute() {
      if (!videoPreview) {
        handleCloseVideo();
      }
    },
    [videoPreview, handleCloseVideo],
  );

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
              {sortedTagList.map((tag, index) => {
                const isMainTag = tag?.name === postType;
                return (
                  <Tag
                    key={tag?.name + index}
                    name={tag.name}
                    variant={isMainTag && !isMobile ? 'primary' : undefined}
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
          {(youtubeId || moreUrl) && (
            <div className={styles.buttons}>
              {youtubeId && (
                <Button
                  onClick={handleWatchVideoButtonClick}
                  variant="primary"
                  size="large"
                  rightIcon="play-button"
                >
                  Watch video
                </Button>
              )}
              {moreUrl && (
                <Button href={moreUrl} variant="secondary" size="large">
                  Read more
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>

      {youtubeId && (
        <VideoYoutube
          youtubeId={youtubeId}
          isActive={isPlayerActive}
          onClose={handleCloseVideo}
        />
      )}
    </div>
  );
}
