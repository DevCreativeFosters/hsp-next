import { useEffect } from 'react';

export default function useMobileVh() {
  useEffect(() => {
    const calculateVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    window.addEventListener('resize', calculateVh);
    window.addEventListener('orientationchange', calculateVh);
    calculateVh();

    return () => {
      window.removeEventListener('resize', calculateVh);
      window.removeEventListener('orientationchange', calculateVh);
      document.documentElement.style.removeProperty('--vh');

      // this should re-add `--vh` if there are still other instances of useMobileVh in place
      window.dispatchEvent(new Event('resize'));
    };
  }, []);
}
