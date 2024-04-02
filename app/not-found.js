'use client';

import { useEffect } from 'react';

import { redirect } from 'next/navigation';

import routes from '@lib/routes';

export default function NotFound() {
  useEffect(() => {
    redirect(routes.error);
  }, []);

  return null;
}
