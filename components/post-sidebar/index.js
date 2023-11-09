'use client';

import { useCallback, useEffect } from 'react';

export default function PostSidebar({ children, elementRef, setIsSticky }) {
  const handleScroll = useCallback(() => {
    const informationElement = elementRef.current;
    if (informationElement) {
      const infoRect = informationElement.getBoundingClientRect();
      setIsSticky(infoRect.top <= 120);
    }
  }, [elementRef, setIsSticky]);

  useEffect(() => {
    handleScroll();

    document.body.addEventListener('scroll', handleScroll);
    return () => {
      document.body.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return <>{children}</>;
}
