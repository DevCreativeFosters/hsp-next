import { useCallback, useEffect, useState } from 'react';

export function useIsMobile(breakpointWidth) {
  const [isMobile, setIsMobile] = useState(undefined);
  const screenWidth = breakpointWidth || 768;

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < screenWidth);
  }, [screenWidth]);

  useEffect(() => {
    handleResize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
