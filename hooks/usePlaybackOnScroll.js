import { useEffect } from 'react';

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.2,
};

export default function usePlaybackOnScroll(videoRef) {
  useEffect(
    function controlVideoPlayOnScroll() {
      const videoElement = videoRef.current;
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      }, options);

      if (videoElement) {
        observer.observe(videoElement);
      }

      return () => observer.unobserve(videoElement);
    },
    [videoRef],
  );
}
