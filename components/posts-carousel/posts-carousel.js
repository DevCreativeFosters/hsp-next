'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import Container from '@components/container/container';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';
import Tile from '@components/tile/tile';

import styles from './posts-carousel.module.scss';

export default function PostsCarousel({
  button,
  description,
  posts,
  title,
  titleTag,
  titleTagStyle,
}) {
  const isMobile = useIsMobile();
  const swiperRef = useRef(null);

  const groupSize = isMobile ? 1 : 3;
  const groupedPosts = useMemo(() => {
    return posts
      ? posts.reduce((acc, post, index) => {
          if (index % groupSize === 0) {
            acc.push([]);
          }
          acc[acc.length - 1].push(post);
          return acc;
        }, [])
      : [];
  }, [groupSize, posts]);

  useEffect(
    function makeSlidesSameHeight() {
      if (swiperRef.current) {
        let maxHeight = 0;
        swiperRef.current.slides.forEach(slide => {
          const slideHeight = slide.offsetHeight;
          maxHeight = Math.max(maxHeight, slideHeight);
        });

        swiperRef.current.slides.forEach(slide => {
          slide.style.height = `${maxHeight}px`;
        });

        swiperRef.current.update();
      }
    },
    [groupedPosts, isMobile],
  );

  const handlePrevClick = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  }, []);

  const handleNextClick = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }, []);

  return (
    <Container collapseMargin flexibleBlockPadding>
      <SectionIntro
        description={description}
        fitInline
        title={title}
        titleTag={titleTag}
        titleTagStyle={titleTagStyle}
      >
        <SectionButtons>
          <div className={styles.actionButtons}>
            {groupedPosts.length > 1 && (
              <div className={styles.swiperButtons}>
                <Button
                  onClick={handlePrevClick}
                  rightIcon="arrow-previous"
                  variant="secondary"
                />
                <Button
                  onClick={handleNextClick}
                  rightIcon="arrow-next"
                  variant="secondary"
                />
              </div>
            )}
            <Button href={button.url} variant={button.variant}>
              {button.title}
            </Button>
          </div>
        </SectionButtons>
      </SectionIntro>

      <Swiper
        className={styles.swiper}
        loop={false}
        navigation
        onSwiper={swiper => (swiperRef.current = swiper)}
        slidesPerGroup={1}
        slidesPerView={1}
        spaceBetween={isMobile ? 0 : 24}
        watchSlidesProgress
      >
        {groupedPosts.map((group, groupIndex) => (
          <SwiperSlide key={groupIndex}>
            <div className={styles.postContainer}>
              {group.map((props, index) => (
                <Tile key={index} {...props} />
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}
