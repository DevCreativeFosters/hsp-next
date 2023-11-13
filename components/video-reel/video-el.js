'use client';

import routes from '@lib/routes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import clsx from 'clsx';
import canAutoplay from 'can-autoplay';
import { isVideoPlaying } from '@lib/media';
import { getIcon } from '@lib/icons';
import Button from '@components/button/button';
import styles from '@components/video-reel/video-el.module.scss';

const SpeakerIcon = getIcon('speaker');

export default function VideoEl({ isActive, thumbnail, video }) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlayButtonVisible, setIsPlayButtonVisible] = useState(false);
  const [canAutoplayWithSound, setCanAutoplayWithSound] = useState(undefined);
  const areEventsAttached = useRef(false);
  const isSeekingRef = useRef(false);
  const videoRef = useRef(null);
  const videoUrl = video?.mediaItemUrl;
  const videoExtension = videoUrl?.split('.').slice(-1)?.[0];

  const router = useRouter();

  const onCanPlay = useCallback(() => {
    if (!isVideoReady) {
      setIsVideoReady(true);
    }
  }, [isVideoReady]);

  const onEnd = useCallback(() => {
    videoRef.current.currentTime = 0;
    setIsPlayButtonVisible(true);
  }, []);

  const onPlay = useCallback(() => {
    setIsPlayButtonVisible(false);
  }, []);

  const onPause = useCallback(() => {
    if (videoRef.current) {
      setIsPlayButtonVisible(true);
    }
  }, []);

  const onPlayButtonClick = useCallback(() => {
    setIsPlayButtonVisible(false);
    videoRef.current.play();
  }, []);

  const onVideoClick = useCallback(() => {
    if (isActive && !isSeekingRef.current) {
      setCanAutoplayWithSound(true);
      const el = videoRef.current;
      const actionType = isVideoPlaying(el) ? 'pause' : 'play';
      el[actionType]();
    }
  }, [isActive]);

  const onSoundButtonClick = useCallback(() => {
    setCanAutoplayWithSound(true);
    videoRef.current?.play(); // failsafe
  }, []);

  const onBackButtonClick = useCallback(() => {
    if (sessionStorage.getItem('prevPathname')) {
      router.back();
    } else {
      router.push(routes.home);
    }
  }, [router]);

  useEffect(
    function determineCanAutoplay() {
      canAutoplay.video({ muted: false }).then(({ result }) => {
        setCanAutoplayWithSound(result);
      });
    },
    [isActive],
  );

  useEffect(
    function attachEventListeners() {
      const el = videoRef.current;
      if (el && !areEventsAttached.current) {
        el.addEventListener('canplay', onCanPlay);
        el.addEventListener('canplaythrough', onCanPlay);
        el.addEventListener('play', onPlay);
        el.addEventListener('pause', onPause);
        el.addEventListener('ended', onEnd);
        areEventsAttached.current = true;
      }

      return () => {
        el?.removeEventListener('canplay', onCanPlay);
        el?.removeEventListener('canplaythrough', onCanPlay);
        el?.removeEventListener('play', onPlay);
        el?.removeEventListener('pause', onPause);
        el?.removeEventListener('ended', onEnd);

        areEventsAttached.current = false;
      };
    },
    [videoUrl, isActive, onCanPlay, onPlay, onPause, onEnd],
  );

  useEffect(
    function syncPlayback() {
      if (isActive && isVideoReady) {
        videoRef.current.play();
      }
    },
    [isActive, isVideoReady],
  );

  return (
    <>
      {isActive && (
        <video
          muted={canAutoplayWithSound === false}
          ref={videoRef}
          className={styles.video}
          controls
          playsInline
          autoPlay
        >
          <source
            src={videoUrl}
            type={videoExtension ? `video/${videoExtension}` : null}
          />
          Your browser does not support the video tag.
        </video>
      )}

      {thumbnail.sourceUrl && (
        <Image
          className={clsx(styles.thumbnail, {
            [styles.isVisible]: !isActive,
          })}
          src={thumbnail.sourceUrl}
          height={546}
          width={294}
          alt={thumbnail.altText}
        />
      )}

      {isActive && isPlayButtonVisible && (
        <button
          type="button"
          className={clsx(styles.button, styles.playButton)}
          onClick={onPlayButtonClick}
        />
      )}

      {isActive && !isPlayButtonVisible && !canAutoplayWithSound && (
        <button
          type="button"
          className={clsx(styles.button, styles.soundButton)}
          onClick={onSoundButtonClick}
        >
          <SpeakerIcon />
        </button>
      )}

      <Button
        className={styles.buttonBack}
        variant="tertiary"
        size="large"
        leftIcon="arrow-backward"
        onClick={onBackButtonClick}
      />

      <div className={styles.cursorOnly} onClick={onVideoClick} />
    </>
  );
}
