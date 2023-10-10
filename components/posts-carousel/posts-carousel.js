'use client';

import { useCallback, useRef, useEffect, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Tile from '@components/tile/tile';
import Container from '@components/container/container';
import Button from '@components/button/button';
import { useIsMobile } from '@hooks/useIsMobile';
import 'swiper/css';
import styles from './posts-carousel.module.scss';

export default function PostsCarousel({ title, description, button, posts }) {
  const isMobile = useIsMobile();
  let swiperRef = useRef(null);

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
  }, [posts, groupSize]);

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
    <Container>
      <div className={styles.container}>
        <div className={styles.sectionInformation}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.text}>
              {description && <p>{description}</p>}
            </div>
          </div>
          <div className={styles.actionButtons}>
            {groupedPosts.length > 1 && (
              <div className={styles.swiperButtons}>
                <Button
                  onClick={handlePrevClick}
                  variant="secondary"
                  rightIcon="arrow-previous"
                />
                <Button
                  onClick={handleNextClick}
                  variant="secondary"
                  rightIcon="arrow-next"
                />
              </div>
            )}
            <Button href={button.url} variant={button.variant}>
              {button.title}
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.posts}>
        <Swiper
          className={styles.swiper}
          slidesPerView={1}
          spaceBetween={isMobile ? 0 : 24}
          navigation
          onSwiper={swiper => (swiperRef.current = swiper)}
          loop={false}
          slidesPerGroup={1}
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
      </div>
    </Container>
  );
}
