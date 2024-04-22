'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useVehicleContext } from '@contexts/vehicle';

import Loading from '@components/loading/loading';

import styles from './not-compatible.module.scss';

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

  return (
    <>
      {!productNotCompatible && (
        <div className={styles.container}>
          <Loading color="white" />
        </div>
      )}
    </>
  );
}
