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
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [userVehicleProductRoute, setUserVehicleProductRoute] = useState(null);
  const [shouldDisplayPopup, setShouldDisplayPopup] = useState(false);
  const {
    checkingProductCompatibility,
    enteredProductPageRef,
    isProductCompatible,
    isProductPageWithoutMakeAndModel,
    maker,
    model,
    popupOpen,
    setPopupOpen,
  } = useVehicleContext();

  const isAlreadyOnVehicleRoute = useCallback(() => {
    const pathParts = pathname.split('/').filter(Boolean);
    const makerSlug = getValueOrSlug(maker);
    const modelSlug = getValueOrSlug(model);

    const isOnMakePage =
      pathParts.length === 2 && pathParts[1] === makerSlug && !modelSlug;

    const isOnModelPage =
      pathParts.length >= 3 &&
      pathParts[1] === makerSlug &&
      pathParts[2] === modelSlug;

    return isProductPageWithoutMakeAndModel || isOnMakePage || isOnModelPage;
  }, [isProductPageWithoutMakeAndModel, maker, model, pathname]);

  useEffect(
    function updateProductRedirectRoute() {
      try {
        const mainCategorySlug = pathname.split('/')[1];
        if (!mainCategorySlug) {
          throw new Error(
            'Main category slug could not be determined from pathname.',
          );
        }

        const newRoute = routes.product(
          mainCategorySlug,
          getValueOrSlug(maker),
          getValueOrSlug(model),
        );

        setUserVehicleProductRoute(newRoute);
      } catch (error) {
        console.error('Error updating product redirect route:', error.message);
      }
    },
    [maker, model, pathname],
  );

  useEffect(
    function displayPopupMobileLogic() {
      let storedValues = { maker: null, model: null };

      try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          storedValues = JSON.parse(storedData);
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }

      const currentMaker = getValueOrSlug(maker);
      const currentModel = getValueOrSlug(model);
      const isCurrentRoute = isAlreadyOnVehicleRoute();

      if (enteredProductPageRef.current && !isCurrentRoute) {
        if (
          (currentMaker && currentMaker !== (storedValues.maker || null)) ||
          (currentModel && currentModel !== (storedValues.model || null))
        ) {
          setPopupOpen(true);
        } else {
          setPopupOpen(false);
        }
      }

      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            maker: currentMaker ?? storedValues.maker,
            model: currentModel ?? storedValues.model,
          }),
        );
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    },
    [
      enteredProductPageRef,
      isAlreadyOnVehicleRoute,
      maker,
      model,
      setPopupOpen,
    ],
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
      const isCurrentRoute = isAlreadyOnVehicleRoute();

      const shouldDisplayPopup =
        Boolean(makerSlug || modelSlug) && !isCurrentRoute;

      setShouldDisplayPopup(shouldDisplayPopup);

      if (!isMobile) {
        setPopupOpen(shouldDisplayPopup);
      }
    },
    [isAlreadyOnVehicleRoute, isMobile, maker, model, setPopupOpen],
  );

  useEffect(function clearOnReload() {
    // TODO: alternative to localStorage?

    const clearLocalStorage = () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    window.addEventListener('beforeunload', clearLocalStorage);

    return () => {
      window.removeEventListener('beforeunload', clearLocalStorage);
    };
  }, []);

  if (isAlreadyOnVehicleRoute()) {
    return null;
  }

  return (
    <>
      <div
        className={clsx(styles.popup, {
          [styles.open]:
            popupOpen && !checkingProductCompatibility && isProductCompatible,
        })}
      >
        <div className={styles.container}>
          <h3 className={styles.title}>Suits Your Ute!</h3>
          <p className={styles.message}>
            We have this product available for{' '}
            <strong>
              {getNameOrLabel(maker)} {model ? `${getNameOrLabel(model)}` : ''}
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
