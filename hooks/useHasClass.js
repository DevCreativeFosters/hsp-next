'use client';

import { useEffect, useState } from 'react';
export default function (className, element) {
  const [isPresent, setIsPresent] = useState(undefined);

  useEffect(function watchForFullscreenClass() {
    const observer = new MutationObserver(entries => {
      const entry = entries.filter(
        ({ attributeName }) => attributeName === 'class',
      )[0];
      if (entry) {
        setIsPresent(Array.from(entry.target.classList).includes(className));
      }
    });

    observer.observe(element || document.documentElement, {
      attributes: true,
      childList: false,
      subtree: false,
    });

    return () => observer.disconnect();
  }, []);

  return isPresent;
}
