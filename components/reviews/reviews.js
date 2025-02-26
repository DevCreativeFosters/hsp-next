'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import Container from '@components/container/container';
import SectionButtons from '@components/section-buttons/section-buttons';
import SectionIntro from '@components/section-intro/section-intro';

import Review from './review';
import styles from './reviews.module.scss';

export default function Reviews({ data }) {
  const [windowWidth, setWindowWidth] = useState(0);
  const isMobile = useIsMobile();
  const swiperRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const reviews = data?.reviews;

  const groupSize = windowWidth >= 1280 ? 4 : windowWidth >= 768 ? 3 : 1;
  const groupedReviews = reviews
    ? reviews.reduce((acc, review, index) => {
        if (index % groupSize === 0) {
          acc.push([]);
        }
        acc[acc.length - 1].push(review);
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
    <Container collapseTopMargin>
      <SectionIntro
        description={data?.description}
        fitInline
        title={data?.title}
        titleTag={data?.titleTag}
        titleTagStyle={data?.titleTagStyle}
      >
        <SectionButtons>
          <div className={styles.actionButtons}>
            {groupedReviews.length > 1 && (
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
            <Button
              className={styles.allReviewsButton}
              href={data?.allReviewsLink?.link?.url}
              rightIcon="external-link"
            >
              {data?.allReviewsLink?.link?.title}
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
        {groupedReviews.map((group, groupIndex) => (
          <SwiperSlide key={groupIndex}>
            <div className={styles.reviewContainer}>
              {group.map((review, index) => (
                <Review
                  key={index}
                  name={review.reviewerName}
                  score={review.score}
                  text={review.reviewText}
                />
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}
