import { useEffect, useState, useCallback } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
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

  return isMobile;
}
