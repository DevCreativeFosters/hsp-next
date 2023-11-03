import { useEffect, useState, useCallback } from 'react';

export function useIsMobile(breakpointWidth) {
  const [isMobile, setIsMobile] = useState(false);
  const screenWidth = breakpointWidth || 768;

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < screenWidth);
  }, [screenWidth]);

  useEffect(() => {
    handleResize();
  }, []);

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
