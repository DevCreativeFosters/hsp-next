'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

export default function RootLayoutClient() {
  const pathname = usePathname();

  useEffect(() => {
    const sessionCurrentPathname = sessionStorage.getItem('currentPathname');

    if (pathname !== sessionCurrentPathname) {
      if (sessionCurrentPathname) {
        sessionStorage.setItem('prevPathname', sessionCurrentPathname);
      }
      sessionStorage.setItem('currentPathname', pathname);
    }
  }, [pathname]);

  return null;
}
