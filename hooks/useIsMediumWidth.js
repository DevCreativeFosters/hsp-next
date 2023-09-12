import { useEffect, useState, useCallback } from 'react';

export function useIsMediumWidth() {
  const [isMedium, setIsMedium] = useState(false);

  const handleResize = useCallback(() => {
    setIsMedium(window.innerWidth >= 768 && window.innerWidth < 1280);
  }, []);

  useEffect(handleResize);

  useEffect(
    function syncIsMobile() {
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },
    [handleResize],
  );

  return isMedium;
}
