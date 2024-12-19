'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useVehicleContext } from '@contexts/vehicle';

import routes from '@lib/routes';

export default function NotCompatible({ slug }) {
  const router = useRouter();
  const {
    isProductCompatible,
    setCheckingProductCompatibility,
    setIsProductCompatible,
  } = useVehicleContext();

  useEffect(
    function handleProductCompatibility() {
      setCheckingProductCompatibility(false);
      setIsProductCompatible(false);
    },
    [setCheckingProductCompatibility, setIsProductCompatible],
  );

  useEffect(
    function updateBrowserHistory() {
      if (typeof slug !== 'string' || isProductCompatible === false) {
        return;
      }

      const path = routes.product(slug);

      window.history.replaceState(null, '', path);
    },
    [isProductCompatible, router, slug],
  );
}
