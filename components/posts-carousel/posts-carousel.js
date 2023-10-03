'use client';

import { useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useIsMobile } from '@hooks/useIsMobile';

import Tile from '@components/tile/tile';
import Container from '@components/container/container';
import Button from '@components/button/button';
import styles from './posts-carousel.module.scss';

export default function PostsCarousel({ title, description, button, posts }) {
  const isMobile = useIsMobile();
  let swiperRef = useRef(null);

  const groupSize = isMobile ? 1 : 3;
  const groupedPosts = posts
    ? posts.reduce((acc, post, index) => {
        if (index % groupSize === 0) {
          acc.push([]);
        }
        acc[acc.length - 1].push(post);
        return acc;
      }, [])
    : [];

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
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.text}>
            {description && <p>{description}</p>}
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
            <Button
              href={button.url}
              variant={button.variant}
              rightIcon="external-link"
            >
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
