'use client';

import { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { useParams, usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { useVehicleContext } from '@contexts/vehicle';

import { getNameOrLabel, getValueOrSlug } from '@lib/helpers';
import routes from '@lib/routes';

import Button from '@components/button/button';

import BellIcon from '@assets/icons/bell.svg';

import styles from './product-compatibility-popup.module.scss';

export default function ProductCompatibilityPopup() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [userVehicleProductRoute, setUserVehicleProductRoute] = useState(null);
  const [shouldDisplayPopup, setShouldDisplayPopup] = useState(false);
  const {
    checkingProductCompatibility,
    isProductCompatible,
    maker,
    model,
    popupOpen,
    setPopupOpen,
  } = useVehicleContext();

  useEffect(
    function updateProductRedirectRoute() {
      const { slug } = params;

      const newRoute = routes.product(
        slug,
        getValueOrSlug(maker),
        getValueOrSlug(model),
      );

      if (pathname !== newRoute) {
        setUserVehicleProductRoute(newRoute);
      }
    },
    [maker, model, params, pathname],
  );

  const handleProductRoute = useCallback(() => {
    if (userVehicleProductRoute) {
      router.push(userVehicleProductRoute);
    }
  }, [router, userVehicleProductRoute]);

  useEffect(
    function displayPopup() {
      const makerSlug = getValueOrSlug(maker);
      const modelSlug = getValueOrSlug(model);

      const { makeSlug, modelSlug: paramModelSlug } = params;

      const shouldDisplayPopup = Boolean(
        (makerSlug || modelSlug) &&
          (makeSlug !== makerSlug || paramModelSlug?.[0] !== modelSlug),
      );

      setShouldDisplayPopup(shouldDisplayPopup);
      setPopupOpen(shouldDisplayPopup);
    },
    [maker, model, params, setPopupOpen],
  );

  return (
    <>
      <div
        className={clsx(styles.popup, {
          [styles.open]:
            popupOpen && !checkingProductCompatibility && isProductCompatible,
        })}
      >
        <div className={styles.container}>
          <h3 className={styles.title}>Good News!</h3>
          <p className={styles.message}>
            We have this product available for{' '}
            <strong>
              {getNameOrLabel(maker)} {model ? `${getNameOrLabel(model)}!` : ''}
            </strong>
          </p>
          <div className={styles.buttons}>
            <Button
              className={styles.button}
              onClick={() => handleProductRoute()}
              rightIcon="arrow-forward"
              size="small"
            >
              {model ? 'Go to product page' : 'Go to make page'}
            </Button>
            <Button
              className={styles.button}
              onClick={() => setPopupOpen(false)}
              size="small"
              variant="secondary"
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      {shouldDisplayPopup && (
        <button
          aria-label="Open product compatibility popup"
          className={clsx(styles.notificationBell, {
            [styles.open]: !popupOpen && !checkingProductCompatibility,
          })}
          onClick={() => setPopupOpen(true)}
          role="button"
          type="button"
        >
          <BellIcon />
        </button>
      )}
    </>
  );
}
