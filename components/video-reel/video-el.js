'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import canAutoplay from 'can-autoplay';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { getIcon } from '@lib/icons';
import { isVideoPlaying } from '@lib/media';
import routes from '@lib/routes';

import Button from '@components/button/button';
import styles from '@components/video-reel/video-el.module.scss';

const SpeakerIcon = getIcon('speaker');

export default function VideoEl({ isActive, onTimeUpdate, thumbnail, video }) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlayButtonVisible, setIsPlayButtonVisible] = useState(false);
  const [canAutoplayWithSound, setCanAutoplayWithSound] = useState(undefined);
  const areEventsAttached = useRef(false);
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
    videoRef.current.play().catch(() => null);
  }, []);

  const onVideoClick = useCallback(() => {
    if (isActive) {
      const el = videoRef.current;
      const actionType = isVideoPlaying(el) ? 'pause' : 'play';
      if (canAutoplayWithSound) {
        el[actionType]();
      }
      setCanAutoplayWithSound(true);
    }
  }, [canAutoplayWithSound, isActive]);

  const onSoundButtonClick = useCallback(() => {
    setCanAutoplayWithSound(true);
    videoRef.current?.play().catch(() => null); // failsafe
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
        if (onTimeUpdate) {
          el.addEventListener('timeupdate', onTimeUpdate);
        }
        areEventsAttached.current = true;
      }

      return () => {
        el?.removeEventListener('canplay', onCanPlay);
        el?.removeEventListener('canplaythrough', onCanPlay);
        el?.removeEventListener('play', onPlay);
        el?.removeEventListener('pause', onPause);
        el?.removeEventListener('ended', onEnd);
        if (onTimeUpdate) {
          el?.removeEventListener('timeupdate', onTimeUpdate);
        }
        areEventsAttached.current = false;
      };
    },
    [isActive, onCanPlay, onEnd, onPause, onPlay, onTimeUpdate, videoUrl],
  );

  useEffect(
    function syncPlayback() {
      if (isActive && isVideoReady) {
        videoRef.current.play().catch(() => null);
      }
    },
    [isActive, isVideoReady],
  );

  return (
    <>
      {isActive && (
        <video
          autoPlay
          className={styles.video}
          controls
          disablePictureInPicture
          muted={canAutoplayWithSound === false}
          playsInline
          ref={videoRef}
        >
          <source
            src={videoUrl}
            type={videoExtension ? `video/${videoExtension}` : null}
          />
          Your browser does not support the video tag.
        </video>
      )}

      {thumbnail?.sourceUrl && (
        <Image
          alt={thumbnail.altText}
          className={clsx(styles.thumbnail, {
            [styles.isVisible]: !isActive,
          })}
          height={546}
          src={thumbnail.sourceUrl}
          width={294}
        />
      )}

      {isActive && isPlayButtonVisible && (
        <button
          className={clsx(styles.button, styles.playButton)}
          onClick={onPlayButtonClick}
          type="button"
        />
      )}

      {isActive && !isPlayButtonVisible && !canAutoplayWithSound && (
        <button
          className={clsx(styles.button, styles.soundButton)}
          onClick={onSoundButtonClick}
          type="button"
        >
          <SpeakerIcon />
        </button>
      )}

      <Button
        className={styles.buttonBack}
        leftIcon="arrow-backward"
        onClick={onBackButtonClick}
        size="large"
        variant="tertiary"
      />

      <div className={styles.cursorOnly} onClick={onVideoClick} />
    </>
  );
}
