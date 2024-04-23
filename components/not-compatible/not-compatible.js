'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useVehicleContext } from '@contexts/vehicle';

export default function NotCompatible({ slug }) {
  const router = useRouter();
  const { productNotCompatible, setProductNotCompatible } = useVehicleContext();

  useEffect(() => {
    if (setProductNotCompatible === undefined) {
      return;
    }

    setProductNotCompatible(true);
  }, [setProductNotCompatible]);

  useEffect(() => {
    if (typeof slug !== 'string' || productNotCompatible === undefined) {
      return;
    }

    const path = `/${slug}`;

    window.history.replaceState(null, '', path);
  }, [productNotCompatible, router, slug]);
}
