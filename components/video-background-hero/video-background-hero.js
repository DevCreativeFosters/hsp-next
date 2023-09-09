'use client';

import { useRef, useEffect } from 'react';

import Container from '@components/container/container';
import Button from '@components/button';

import styles from './video-background-hero.module.scss';

export default function VideoBackgroundHero({
  title,
  description,
  linkLabel,
  videoUrl,
}) {
  const videoRef = useRef(null);

  useEffect(function controlVideoPlayOnScroll() {
    const videoElement = videoRef.current;
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }, options);

    observer.observe(videoElement);

    return () => observer.unobserve(videoElement);
  }, []);

  return (
    <Container>
      <div className={styles.hero}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <Button
          size="large"
          onClick={() => null} // WIP - add video modal popup functionality
          rightIcon="play-button"
          style={{ width: 'fit-content' }}
        >
          {linkLabel}
        </Button>
      </div>

      <video className={styles.video} ref={videoRef} loop muted>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.backgroundGradient} />
    </Container>
  );
}
