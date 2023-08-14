import { useRef, useEffect } from 'react';

export const useClickOutside = (cb, refs = []) => {
  const singleRef = useRef();
  const allRefs = refs.length ? refs : [singleRef];

  useEffect(() => {
    const handleClick = ev => {
      const container = allRefs.find(ref => ref.current?.contains(ev.target));
      if (!container && typeof cb === 'function') {
        cb();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [cb]);
};
