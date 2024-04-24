'use client';

import AnimateHeight from 'react-animate-height';

import useHasClass from '@hooks/useHasClass';
import { useIsMobile } from '@hooks/useIsMobile';

import { STORE_LOCATOR_FULLSCREEN } from '@lib/class-names';

export default function FullscreenCollapse({ children, className }) {
  const isFullScreen = useHasClass(STORE_LOCATOR_FULLSCREEN);
  const isMobile = useIsMobile();
  return (
    <AnimateHeight
      contentClassName={className}
      duration={300}
      height={isFullScreen && isMobile ? 0 : 'auto'}
    >
      {children}
    </AnimateHeight>
  );
}
