'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import Container from '@components/container/container';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import VideoEl from '@components/video-reel/video-el';
import VideoReel from '@components/video-reel/video-reel';

import styles from './page-client.module.scss';

export default function PageClient({ description, posts = [], title }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(undefined);
  const [showMessage, setShowMessage] = useState(false);
  const messageShownRef = useRef({ end: {}, start: {} });

  const isMobile = useIsMobile();

  const onPrev = useCallback(() => {
    const newIndex = Math.max(0, currentIndex - 1);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex]);

  const onNext = useCallback(() => {
    setCurrentIndex(Math.min(currentIndex + 1, posts.length - 1));
  }, [currentIndex, posts.length]);

  const findSlugByIndex = useCallback(
    index => {
      return posts[index]?.slug;
    },
    [posts],
  );

  const findIndexBySlug = useCallback(
    slugParam => {
      const post = posts.find(({ slug }) => slug === slugParam);
      if (post) {
        return posts.indexOf(post);
      }
      return -1;
    },
    [posts],
  );

  useEffect(
    function syncHashWithCurrentIndex() {
      const hash = window.location.hash;
      if (currentIndex === undefined) {
        const slugFromHash = hash[0] === '#' ? hash.slice(1) : hash;
        const index = findIndexBySlug(slugFromHash);
        setCurrentIndex(index > -1 ? index : 0);
      } else {
        const slugFromIndex = findSlugByIndex(currentIndex);
        const slugFromHash = hash[0] === '#' ? hash.slice(1) : hash;
        if (slugFromIndex !== slugFromHash) {
          router.replace(`#${slugFromIndex}`, { scroll: false });
        }
      }
    },
    [currentIndex, findIndexBySlug, findSlugByIndex, router],
  );

  if (isMobile === undefined) {
    return null;
  } else if (isMobile) {
    const handleVideoProgress = (event, index) => {
      const video = event.target;
      const isNearStart = video.currentTime < 3;
      const isNearEnd = video.duration - video.currentTime < 3;

      // Show message at start if not shown yet
      if (isNearStart && !messageShownRef.current.start[index]) {
        messageShownRef.current.start[index] = true;
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 4000);
      }

      // Show message at end if not shown yet
      if (isNearEnd && !messageShownRef.current.end[index]) {
        messageShownRef.current.end[index] = true;
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 4000);
      }
    };

    const handleSlideChange = swiper => {
      const newIndex = swiper.activeIndex;
      setCurrentIndex(newIndex);
      // Reset the flags for the new slide
      messageShownRef.current.start[newIndex] = false;
      messageShownRef.current.end[newIndex] = false;
    };

    return (
      <div className={styles.fullscreenContainer}>
        <Swiper
          className={styles.swiper}
          initialSlide={currentIndex}
          onSlideChange={handleSlideChange}
        >
          {posts.map((post, index) => (
            <SwiperSlide className={styles.swiperSlide} key={index}>
              <VideoEl
                isActive={index === currentIndex}
                onTimeUpdate={e => handleVideoProgress(e, index)}
                thumbnail={post.celebrityPostsCustomFields?.thumbnail?.node}
                video={post.celebrityPostsCustomFields?.video?.node}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {showMessage && (
          <div className={styles.navigationMessage}>
            <span>Swipe to navigate between videos</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Container>
      <SectionIntro description={description} fitInline title={title}>
        <SectionButtons className={styles.buttons}>
          <Button
            className={styles.buttonPrev}
            leftIcon="arrow-previous"
            onClick={onPrev}
            variant="secondary"
          />

          <Button
            className={styles.buttonNext}
            onClick={onNext}
            rightIcon="arrow-next"
            variant="secondary"
          />
        </SectionButtons>
      </SectionIntro>

      <VideoReel
        currentIndex={currentIndex}
        items={posts || []}
        setCurrentIndex={setCurrentIndex}
      />
    </Container>
  );
}
