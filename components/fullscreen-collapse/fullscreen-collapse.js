'use client';

import AnimateHeight from 'react-animate-height';
import useHasClass from '@hooks/useHasClass';
import { STORE_LOCATOR_FULLSCREEN } from '@lib/class-names';

export default function FullscreenCollapse({ className, children }) {
  const isFullScreen = useHasClass(STORE_LOCATOR_FULLSCREEN);
  return (
    <AnimateHeight
      height={isFullScreen ? 0 : 'auto'}
      duration={300}
      contentClassName={className}
    >
      {children}
    </AnimateHeight>
  );
}
