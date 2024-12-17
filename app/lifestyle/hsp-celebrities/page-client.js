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
  const lastMessageTimeRef = useRef({});

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
      const currentTime = video.currentTime;
      const isNearStart = currentTime < 3;
      const isNearEnd = video.duration - currentTime < 3;

      // Only show message if we haven't shown one in the last 5 seconds
      const now = Date.now();
      const lastShown = lastMessageTimeRef.current[index] || 0;

      if ((isNearStart || isNearEnd) && now - lastShown > 5000) {
        lastMessageTimeRef.current[index] = now;
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
    };

    const handleSlideChange = swiper => {
      setCurrentIndex(swiper.activeIndex);
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
