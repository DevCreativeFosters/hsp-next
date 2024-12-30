'use client';

import { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';

import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import { getNameOrLabel, getValueOrSlug } from '@lib/helpers';
import routes from '@lib/routes';

import Button from '@components/button/button';

import BellIcon from '@assets/icons/bell.svg';

import styles from './product-compatibility-popup.module.scss';

const LOCAL_STORAGE_KEY = 'vehiclePopupPreviousValues';

export default function ProductCompatibilityPopup() {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [userVehicleProductRoute, setUserVehicleProductRoute] = useState(null);
  const [shouldDisplayPopup, setShouldDisplayPopup] = useState(false);
  const {
    checkingProductCompatibility,
    enteredProductPageRef,
    isProductCompatible,
    maker,
    model,
    popupOpen,
    setPopupOpen,
  } = useVehicleContext();

  useEffect(() => {
    const newRoute = routes.product(
      getValueOrSlug(maker),
      getValueOrSlug(model),
    );

    setUserVehicleProductRoute(newRoute);
  }, [maker, model]);

  useEffect(
    function displayPopupMobileLogic() {
      const storedValues = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY),
      ) || {
        maker: null,
        model: null,
      };

      const currentMaker = getValueOrSlug(maker);
      const currentModel = getValueOrSlug(model);

      if (enteredProductPageRef.current) {
        if (
          (currentMaker && currentMaker !== (storedValues.maker || null)) ||
          (currentModel && currentModel !== (storedValues.model || null))
        ) {
          setPopupOpen(true);
        } else {
          setPopupOpen(false);
        }
      }

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          maker: currentMaker ?? storedValues.maker,
          model: currentModel ?? storedValues.model,
        }),
      );
    },
    [enteredProductPageRef, isMobile, maker, model, pathname, setPopupOpen],
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

      const shouldDisplayPopup = Boolean(makerSlug || modelSlug);

      setShouldDisplayPopup(shouldDisplayPopup);

      if (!isMobile) {
        setPopupOpen(shouldDisplayPopup);
      }
    },
    [isMobile, maker, model, setPopupOpen],
  );

  useEffect(function clearOnReload() {
    const clearLocalStorage = () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    window.addEventListener('beforeunload', clearLocalStorage);

    return () => {
      window.removeEventListener('beforeunload', clearLocalStorage);
    };
  }, []);

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
              Dismiss
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
