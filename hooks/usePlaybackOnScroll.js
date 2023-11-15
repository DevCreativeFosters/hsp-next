import { useEffect } from 'react';
import { isVideoPlaying } from '@lib/media';

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.2,
};

export default function usePlaybackOnScroll(videoRef) {
  useEffect(
    function controlVideoPlayOnScroll() {
      const videoElement = videoRef.current;
      let observer;
      if (videoElement) {
        observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            videoElement.play().catch(() => null);
          } else if (isVideoPlaying(videoElement)) {
            videoElement.pause();
          }
        }, options);

        if (videoElement) {
          observer.observe(videoElement);
        }
      }

      return () => {
        if (observer && videoElement) {
          observer.unobserve(videoElement);
        }
      };
    },
    [videoRef],
  );
}
