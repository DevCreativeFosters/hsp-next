'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

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
  const isMobile = useIsMobile();
  const startY = useRef(null);

  const onNext = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % posts.length);
  }, [posts.length]);

  const onPrev = useCallback(() => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? posts.length - 1 : prevIndex - 1,
    );
  }, [posts.length]);

  const findSlugByIndex = useCallback(index => posts[index]?.slug, [posts]);

  const findIndexBySlug = useCallback(
    slugParam => {
      const post = posts.find(({ slug }) => slug === slugParam);
      return post ? posts.indexOf(post) : -1;
    },
    [posts],
  );

  function syncHashWithCurrentIndex() {
    const hash = window.location.hash;
    if (currentIndex === undefined) {
      const slugFromHash = hash[0] === '#' ? hash.slice(1) : hash;
      const index = findIndexBySlug(slugFromHash);
      setCurrentIndex(index > -1 ? index : 0);
    } else {
      const slugFromIndex = findSlugByIndex(currentIndex);
      router.replace(`#${slugFromIndex}`, { scroll: false });
    }
  }

  useEffect(syncHashWithCurrentIndex, [
    currentIndex,
    findIndexBySlug,
    findSlugByIndex,
    router,
  ]);

  function handleSwipeEvents() {
    if (!isMobile) return;

    const handleTouchStart = e => {
      startY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = e => {
      const endY = e.changedTouches[0].clientY;
      if (startY.current - endY > 50) onNext();
      else if (endY - startY.current > 50) onPrev();
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }

  useEffect(handleSwipeEvents, [isMobile, onNext, onPrev]);

  if (isMobile === undefined) {
    return null;
  } else if (isMobile) {
    const post = posts[currentIndex];
    return (
      <div className={styles.fullscreenContainer}>
        <VideoEl
          isActive={true}
          key={currentIndex}
          thumbnail={post.celebrityPostsCustomFields?.thumbnail?.node}
          video={post.celebrityPostsCustomFields?.video?.node}
        />
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
