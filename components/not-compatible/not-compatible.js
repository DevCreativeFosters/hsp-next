'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useVehicleContext } from '@contexts/vehicle';

import Loading from '@components/loading/loading';

import styles from './not-compatible.module.scss';

export default function NotCompatible({ slug }) {
  const router = useRouter();
  const { productNotCompatible, setProductNotCompatible } = useVehicleContext();

  console.log(productNotCompatible);

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

    router.replace(`/${slug}`);
  }, [productNotCompatible, router, slug]);

  return (
    <div className={styles.container}>
      <Loading color="white" />
    </div>
  );
}
