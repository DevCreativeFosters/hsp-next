import Button from '@components/button/button';
import { ArrowTriplet } from '@components/video-youtube/arrow-triplet';
import { YoutubeCloseButton } from '@components/video-youtube/youtube-close-button';
import { useCallback, useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import clsx from 'clsx';
import styles from './video-youtube.module.scss';

const SEEK_INTERVAL = 5; // [s]

export function VideoYoutube({ youtubeId, isActive, onClose }) {
  const [player, setPlayer] = useState(null);
  const [playbackIcon, setPlaybackIcon] = useState(null);
  const [seekIcon, setSeekIcon] = useState(null);
  const rafHandler = useRef(null);
  const tmoPlaybackHandler = useRef(null);
  const tmoSeekHandler = useRef(null);
  const iframeId = `iframe-${youtubeId}`;

  const onYoutubePlayerReady = useCallback(ev => {
    setPlayer(ev.target);
  }, []);

  const seekBackwards = useCallback(() => {
    const currentTime = player?.playerInfo.currentTime;

    try {
      player?.seekTo(Math.max(currentTime - SEEK_INTERVAL, 0));
      if (seekIcon) {
        setSeekIcon(null);
        requestAnimationFrame(() => {
          setSeekIcon('backwards');
        });
      } else {
        setSeekIcon('backwards');
      }
    } catch (err) {}
  }, [player, seekIcon]);

  const seekForwards = useCallback(() => {
    const duration = player?.playerInfo.duration;
    const currentTime = player?.playerInfo.currentTime;

    player?.seekTo(Math.min(currentTime + SEEK_INTERVAL, duration));
    if (seekIcon) {
      setSeekIcon(null);
      requestAnimationFrame(() => {
        setSeekIcon('forwards');
      });
    } else {
      setSeekIcon('forwards');
    }
  }, [player, seekIcon]);

  const togglePlayback = useCallback(() => {
    const isPlaying =
      player?.getPlayerState() === window.YT?.PlayerState.PLAYING;
    try {
      isPlaying ? player?.pauseVideo() : player?.playVideo();
      setPlaybackIcon(isPlaying ? 'pause' : 'play');
    } catch (err) {}
  }, [player]);

  const onKeyUp = useCallback(
    ev => {
      switch (ev.code) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          seekBackwards();
          break;
        case 'ArrowRight':
          seekForwards();
          break;
        case 'Space':
          togglePlayback();
          break;
        default:
          break;
      }
    },
    [onClose, seekBackwards, seekForwards, togglePlayback],
  );

  const restorePreviouslyActiveElement = useCallback(() => {
    cancelAnimationFrame(rafHandler.current);
    if (isActive && document.activeElement.id === iframeId) {
      document.activeElement.blur();
    }
    rafHandler.current = requestAnimationFrame(() => {
      restorePreviouslyActiveElement();
    });
  }, [isActive, iframeId]);

  useEffect(
    function bindKeyboardEvents() {
      if (isActive) {
        window.addEventListener('keyup', onKeyUp);

        return () => {
          window.removeEventListener('keyup', onKeyUp);
        };
      }
    },
    [isActive, onKeyUp],
  );

  useEffect(
    function playPlayerVideoWhenRequested() {
      try {
        if (isActive) {
          player?.playVideo();
        } else {
          player?.pauseVideo();
        }
      } catch (err) {}
    },
    [player, isActive],
  );

  useEffect(
    function changeActiveElement() {
      if (isActive) {
        restorePreviouslyActiveElement();
      }
    },
    [isActive, restorePreviouslyActiveElement],
  );

  useEffect(
    function hidePlaybackUI() {
      const handler = tmoSeekHandler.current;
      clearTimeout(handler);
      tmoPlaybackHandler.current = setTimeout(() => {
        setPlaybackIcon(null);
      }, 500 + 100);

      return () => {
        clearTimeout(handler);
      };
    },
    [playbackIcon],
  );

  useEffect(
    function hideSeekUI() {
      const handler = tmoSeekHandler.current;
      clearTimeout(handler);
      tmoSeekHandler.current = setTimeout(() => {
        setSeekIcon(null);
      }, 500 + 100);

      return () => {
        clearTimeout(handler);
      };
    },
    [seekIcon],
  );

  return (
    <div
      className={clsx(styles.iframeOuterWrapper, {
        [styles.isVisible]: isActive,
      })}
    >
      <YouTube
        videoId={youtubeId}
        className={styles.iframeInnerWrapper}
        iframeClassName={styles.iframe}
        id={iframeId}
        opts={{
          playerVars: {
            enablejsapi: 1,
            controls: 1,
            autohide: 1,
            autoplay: 0,
            mute: 0,
            rel: 0,
            playsinline: 1,
            showinfo: 0,
          },
        }}
        onReady={onYoutubePlayerReady}
      />

      <div className={styles.ui}>
        <div className={styles.seekBackwards}>
          {seekIcon === 'backwards' && (
            <div className={styles.seekBackground}>
              <ArrowTriplet reversed />
              <div className={styles.seekLabel}>{SEEK_INTERVAL} seconds</div>
            </div>
          )}
        </div>

        {playbackIcon && (
          <div className={styles.playbackBackground}>
            {playbackIcon === 'play' && <div className={styles.playIcon} />}
            {playbackIcon === 'pause' && <div className={styles.pauseIcon} />}
          </div>
        )}

        <div className={styles.seekForwards}>
          {seekIcon === 'forwards' && (
            <div className={styles.seekBackground}>
              <ArrowTriplet />
              <div className={styles.seekLabel}>{SEEK_INTERVAL} seconds</div>
            </div>
          )}
        </div>
      </div>

      <YoutubeCloseButton label="Back" onClick={onClose} />
    </div>
  );
}
