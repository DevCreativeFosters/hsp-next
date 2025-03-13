'use client';

import { useEffect, useRef } from 'react';

import clsx from 'clsx';
import { SwiperSlide } from 'swiper/react';

import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import Carousel from '@components/carousel/carousel';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import Feature from './feature';
import styles from './features.module.scss';

export default function Features({
  cta,
  description: leadingDescription,
  features,
  title: leadingTitle,
  titleTag,
  titleTagStyle,
  video,
}) {
  const videoRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        videoElement.play().catch(() => null);
      } else {
        videoElement.pause();
      }
    }, options);

    observer.observe(videoElement);

    return () => observer.unobserve(videoElement);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.leadingFeature}>
        {leadingTitle && (
          <DynamicTitle
            className={styles.leadingTitle}
            titleTag={titleTag}
            titleTagStyle={titleTagStyle}
          >
            {leadingTitle}
          </DynamicTitle>
        )}
        {leadingDescription && (
          <div
            className={clsx(styles.leadingDescription, 'p-large')}
            dangerouslySetInnerHTML={{ __html: leadingDescription }}
          />
        )}
        {cta && (
          <Button className={styles.leadingButton} href={cta.url} size="large">
            {cta.label}
          </Button>
        )}
      </div>
      {isMobile ? (
        <Carousel
          className={styles.featuresCarousel}
          settings={{
            loop: false,
            slidesPerView: 1.17,
            spaceBetween: 16,
          }}
          slides={features.map((feature, index) => (
            <SwiperSlide className={styles.slide} key={index}>
              <Feature
                description={feature.description}
                index={index}
                title={feature.title}
                titleTag={feature.titleTag}
                titleTagStyle={feature.titleTagStyle}
              />
            </SwiperSlide>
          ))}
        />
      ) : (
        features.map((feature, index) => (
          <Feature
            description={feature.description}
            index={index}
            key={index}
            style={{ order: (index + 1) * 10 }}
            title={feature.title}
            titleTag={feature.titleTag}
            titleTagStyle={feature.titleTagStyle}
          />
        ))
      )}
      {video?.src && (
        <div className={styles.videoTile}>
          <video
            className={styles.video}
            loop
            muted
            playsInline
            poster={video.poster || null}
            ref={videoRef}
            title={video.title || null}
          >
            <source src={video.src} type={video.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
