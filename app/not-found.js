'use client';

import routes from '@lib/routes';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    redirect(routes.error);
  }, []);

  return null;
}
