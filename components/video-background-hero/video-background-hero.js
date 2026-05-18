'use client';

import { useRef } from 'react';

import clsx from 'clsx';

import usePlaybackOnScroll from '@hooks/usePlaybackOnScroll';

import { makeRelativeUrl } from '@lib/helpers';

import Button from '@components/button/button';
import Container from '@components/container/container';
import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './video-background-hero.module.scss';

export default function VideoBackgroundHero({
  description,
  link,
  title,
  titleTag,
  titleTagStyle,
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
          {title && (
            <DynamicTitle
              className={styles.title}
              defaultTag="h1"
              titleTag={titleTag}
              titleTagStyle={titleTagStyle}
            >
              {title}
            </DynamicTitle>
          )}
          <div
            className={clsx(styles.description, 'p-large')}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {link && (
            <Button
              href={makeRelativeUrl(link.url)}
              rightIcon="play-button"
              size="large"
            >
              {link.title}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
