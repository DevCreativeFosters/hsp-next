import { useRef, useEffect } from 'react';

export const useClickOutside = cb => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = ev => {
      if (ref.current && !ref.current.contains(ev.target)) {
        cb();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [cb, ref]);

  return ref;
};
