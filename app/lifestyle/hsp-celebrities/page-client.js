'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import Container from '@components/container/container';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import VideoEl from '@components/video-reel/video-el';
import VideoReel from '@components/video-reel/video-reel';

import styles from './page-client.module.scss';

export default function PageClient({ title, description, posts = [] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(undefined);

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
    const post = posts[currentIndex];
    return (
      <div className={styles.fullscreenContainer}>
        <VideoEl
          isActive={true}
          thumbnail={post.celebrityPostsCustomFields?.thumbnail?.node}
          video={post.celebrityPostsCustomFields?.video?.node}
        />
      </div>
    );
  }

  return (
    <Container>
      <SectionIntro title={title} description={description} fitInline>
        <SectionButtons className={styles.buttons}>
          <Button
            className={styles.buttonPrev}
            variant="secondary"
            leftIcon="arrow-previous"
            onClick={onPrev}
          />

          <Button
            className={styles.buttonNext}
            variant="secondary"
            rightIcon="arrow-next"
            onClick={onNext}
          />
        </SectionButtons>
      </SectionIntro>

      <VideoReel
        items={posts || []}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </Container>
  );
}
