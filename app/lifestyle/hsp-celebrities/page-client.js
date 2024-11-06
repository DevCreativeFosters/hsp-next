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
  const touchRef = useRef({
    isSwiping: false,
    startTime: null,
    startX: null,
    startY: null,
  });

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

  useEffect(
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
    },
    [currentIndex, findIndexBySlug, findSlugByIndex, router],
  );

  useEffect(
    function handleSwipeEvents() {
      if (!isMobile) return;

      const handleTouchStart = e => {
        if (!['BUTTON'].includes(e.target.tagName)) {
          e.preventDefault();
        }

        touchRef.current = {
          isSwiping: false,
          startTime: Date.now(),
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
        };
      };

      const handleTouchMove = e => {
        if (!touchRef.current.startY) return;

        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const deltaY = touchRef.current.startY - currentY;
        const deltaX = Math.abs(touchRef.current.startX - currentX);

        if (deltaX > Math.abs(deltaY)) {
          touchRef.current.isSwiping = false;
          return;
        }

        if (Math.abs(deltaY) > 10) {
          touchRef.current.isSwiping = true;
        }

        if (touchRef.current.isSwiping) {
          e.preventDefault();
        }
      };

      const handleTouchEnd = e => {
        if (!touchRef.current.startY) return;

        const deltaY = touchRef.current.startY - e.changedTouches[0].clientY;
        const deltaTime = Date.now() - touchRef.current.startTime;

        const velocity = Math.abs(deltaY) / deltaTime;

        if (
          touchRef.current.isSwiping &&
          Math.abs(deltaY) > 50 &&
          velocity > 0.15
        ) {
          if (deltaY > 0) {
            onNext();
          } else {
            onPrev();
          }
        }

        touchRef.current = {
          isSwiping: false,
          startTime: null,
          startX: null,
          startY: null,
        };
      };

      window.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    },
    [isMobile, onNext, onPrev],
  );

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
          title={post.title}
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
