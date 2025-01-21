'use client';

import { useEffect, useState } from 'react';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { useVehicleContext } from '@contexts/vehicle';

import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getProductsByCategoriesSlugs } from '@lib/api/get-products-by-categories-slugs';
import { getValueOrSlug } from '@lib/helpers';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import routes from '@lib/routes';

import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

const COOKIE_SAVED_VEHICLE = LOCAL_STORAGE_VEHICLE;

export default function BreadcrumbsProduct({ currentProduct }) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { makeSlug, modelSlug, slug } = params;
  const {
    enteredProductPageRef,
    isProductCompatible,
    maker,
    model,
    setIsProductCompatible,
  } = useVehicleContext();
  const [savedVehicleLocal, setSavedVehicleLocal] = useState(null);

  useEffect(() => {
    let savedVehicleLocal = null;

    if (maker) {
      savedVehicleLocal = localStorage.getItem(COOKIE_SAVED_VEHICLE);
    }

    setSavedVehicleLocal(savedVehicleLocal);
  }, [maker, model]);

  useEffect(
    function checkConfigurationCompatibility() {
      if (!slug || !maker || !savedVehicleLocal) {
        return;
      }

      // we're on the PDP already
      if (slug && modelSlug && makeSlug) {
        return;
      }

      const contextMakeSlug = getValueOrSlug(maker);
      const contextModelSlug = getValueOrSlug(model);

      const savedVehicleLocalData = JSON.parse(savedVehicleLocal);

      const { maker: savedLocalMake, model: savedLocalModel } =
        savedVehicleLocalData;

      const savedLocalMakeSlug = getValueOrSlug(savedLocalMake);
      const savedLocalModelSlug = getValueOrSlug(savedLocalModel);

      if (!contextModelSlug && contextMakeSlug) {
        getMainProductCategory(slug)
          .then(data => {
            if (!data) {
              console.error(
                'Debug: No data received from getMainProductCategory, returning',
              );
              return;
            } else {
              setIsProductCompatible(true);
            }
          })
          .catch(error => {
            console.error('Failed to fetch main product category data:', error);
          });
      }

      if (!contextModelSlug) {
        return;
      }

      if (
        contextModelSlug !== savedLocalModelSlug &&
        contextMakeSlug !== savedLocalMakeSlug
      ) {
        return;
      }

      getProductsByCategoriesSlugs(slug, contextMakeSlug, contextModelSlug)
        .then(data => {
          if (!data || !data.length) {
            console.error(
              'Debug: No data or empty data received from getProductsByCategoriesSlugs',
            );
            setIsProductCompatible(false);
            return;
          } else {
            setIsProductCompatible(true);
          }
        })
        .catch(error => {
          console.error('Failed to fetch product data:', error);
        });
    },
    [
      isProductCompatible,
      maker,
      makeSlug,
      model,
      modelSlug,
      router,
      savedVehicleLocal,
      setIsProductCompatible,
      slug,
    ],
  );

  const items = [
    {
      label: 'Products',
      url: routes.products,
    },
  ];

  if (currentProduct.mainCategory?.value) {
    items.push({
      label: currentProduct.mainCategory.label,
      url: routes.product(currentProduct.mainCategory.value),
    });
  }

  if (currentProduct.make?.value) {
    items.push({
      label: currentProduct.make.label,
      url: routes.product(
        currentProduct.mainCategory.value,
        currentProduct.make.value,
      ),
    });
  }

  if (currentProduct.model?.value) {
    items.push({
      label: currentProduct.model.label,
      strong: true,
      url: pathname,
    });
  }

  if (items.length > 0) {
    items[items.length - 1].strong = true;
  }

  return (
    <div ref={enteredProductPageRef}>
      <Breadcrumbs items={items} />
    </div>
  );
}
