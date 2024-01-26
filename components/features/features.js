'use client';

import { useEffect, useRef } from 'react';
import { SwiperSlide } from 'swiper/react';
import { useIsMobile } from '@hooks/useIsMobile';
import Button from '@components/button/button';
import Carousel from '@components/carousel/carousel';
import Feature from './feature';
import styles from './features.module.scss';

export default function Features({
  title: leadingTitle,
  description: leadingDescription,
  cta,
  video,
  features,
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
          <h2 className={styles.leadingTitle}>{leadingTitle}</h2>
        )}
        {leadingDescription && (
          <div
            className={styles.leadingDescription}
            dangerouslySetInnerHTML={{ __html: leadingDescription }}
          />
        )}
        {cta && (
          <Button href={cta.url} size="large">
            {cta.label}
          </Button>
        )}
      </div>
      {video?.src && (
        <div className={styles.videoTile}>
          <video
            className={styles.video}
            title={video.title || null}
            poster={video.poster || null}
            ref={videoRef}
            loop
            muted
          >
            <source src={video.src} type={video.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {isMobile ? (
        <Carousel
          className={styles.featuresCarousel}
          settings={{
            slidesPerView: 1.17,
            spaceBetween: 16,
            loop: false,
          }}
          slides={features.map((feature, index) => (
            <SwiperSlide key={index}>
              <Feature {...feature} index={index} />
            </SwiperSlide>
          ))}
        />
      ) : (
        features.map((feature, index) => (
          <Feature
            {...feature}
            index={index}
            key={index}
            style={{ order: (index + 1) * 10 }}
          />
        ))
      )}
    </div>
  );
}
