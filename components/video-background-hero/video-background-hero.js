'use client';

import { useRef } from 'react';

import usePlaybackOnScroll from '@hooks/usePlaybackOnScroll';

import Button from '@components/button/button';
import Container from '@components/container/container';

import styles from './video-background-hero.module.scss';

export default function VideoBackgroundHero({
  description,
  link,
  title,
  videoUrl,
}) {
  const videoRef = useRef(null);

  usePlaybackOnScroll(videoRef);

  return (
    <section className={styles.wrapper}>
      <video className={styles.video} loop muted playsInline ref={videoRef}>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.backgroundGradient} />
      <Container>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.description}>{description}</div>
          {link && (
            <Button href={link.url} rightIcon="play-button" size="large">
              {link.title}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
