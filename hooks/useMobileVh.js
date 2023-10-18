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
    };
  }, []);
}
