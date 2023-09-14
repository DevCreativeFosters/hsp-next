'use client';

import { useState, useLayoutEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useIsMobile } from '@hooks/useIsMobile';
import 'swiper/css';

import Container from '@components/container/container';
import Button from '@components/button';
import Review from './review';
import styles from './reviews.module.scss';

export default function Reviews({ data }) {
  const [windowWidth, setWindowWidth] = useState(0);
  const isMobile = useIsMobile();
  let swiperRef = useRef(null);

  useLayoutEffect(() => {
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

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <Container>
      <div className={styles.container}>
        <div className={styles.sectionInformation}>
          <h2 className={styles.title}>{data?.title}</h2>
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: data?.description }}
          />
          <div className={styles.actionButtons}>
            {groupedReviews.length > 1 && (
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
              href={data?.allReviewsLink?.link.url}
              rightIcon="external-link"
            >
              {data?.allReviewsLink?.link.title}
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.reviews}>
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
          {groupedReviews.map((group, groupIndex) => (
            <SwiperSlide key={groupIndex}>
              <div className={styles.reviewContainer}>
                {group.map((review, index) => (
                  <Review
                    key={index}
                    score={review.score}
                    name={review.reviewerName}
                    text={review.reviewText}
                  />
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Container>
  );
}
