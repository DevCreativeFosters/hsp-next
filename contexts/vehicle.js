'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { getProductsByCategoriesSlugs } from '@lib/api/get-products-by-categories-slugs';
import { deleteCookie, setCookie } from '@lib/cookies';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import routes from '@lib/routes';

import { STEP_TITLES } from '@components/builder/builder';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const router = useRouter();
  const params = useParams();
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [maker, setMaker] = useState(null);
  const [model, setModel] = useState(null);
  const [stepNumber, setStepNumber] = useState(0);
  const [stepTitle, setStepTitle] = useState('');
  const [selectedCover, setSelectedCover] = useState(null);
  const [selectedFactoryOptions, setSelectedFactoryOptions] = useState(null);
  const [variant, setVariant] = useState(null);
  const [finalSelection, setFinalSelection] = useState(null);
  const [productNotCompatible, setProductNotCompatible] = useState(false);
  const [savedVehicleGlobal, setSavedVehicleGlobal] = useState({
    maker: '',
    model: '',
    selectedFactoryOptions: [],
  });

  const setVehicleSelection = vehicle => {
    setFinalSelection(vehicle);
  };

  const resetVehicleSelection = () => {
    localStorage.removeItem(LOCAL_STORAGE_VEHICLE);
    deleteCookie(LOCAL_STORAGE_VEHICLE);
    setMaker(null);
    setModel(null);
    setVehicleSelection(null);
    setSavedVehicleGlobal(null);
    setSelectedFactoryOptions(null);
    setStepNumber(0);
    setStepTitle('');
  };

  const handleVehicleReset = useCallback(() => {
    const { makeSlug, modelSlug, slug } = params;

    if (!makeSlug && !modelSlug && !slug) {
      resetVehicleSelection();

      return;
    }

    const products = getProductsByCategoriesSlugs(slug, makeSlug, modelSlug);
    products
      .then(products => {
        resetVehicleSelection();

        if (products.length && slug && typeof slug === 'string') {
          router.push(`/${slug}`);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [params, router]);

  const handleSave = useCallback(
    (params, reload) => {
      const vehicleString = JSON.stringify({
        maker,
        model,
        selectedFactoryOptions,
      });
      localStorage.setItem(LOCAL_STORAGE_VEHICLE, vehicleString);
      setCookie(LOCAL_STORAGE_VEHICLE, vehicleString, 7);

      setSavedVehicleGlobal({ maker, model, selectedFactoryOptions });

      setVehicleSelection({
        makerName: maker?.name || undefined,
        modelName: model?.name || undefined,
        selectedFactoryOptions: selectedFactoryOptions || null,
      });

      setDropdownOpened(false);
      setStepNumber(1);
      setStepTitle(STEP_TITLES[1]);

      if (params) {
        const { mainCategorySlug, makeSlug, modelSlug } = params;

        if (!mainCategorySlug || !makeSlug || !modelSlug) {
          return;
        }

        const newRoute = routes.product(
          mainCategorySlug,
          makeSlug,
          modelSlug,
          variant?.slug,
        );

        router.push(newRoute);
      }

      if (reload) {
        const { mainCategorySlug } = params;
        const newRoute = routes.product(
          mainCategorySlug,
          maker?.slug,
          model?.slug,
        );

        router.push(newRoute);
      }
    },
    [maker, model, router, selectedFactoryOptions, variant],
  );

  return (
    <VehicleContext.Provider
      value={{
        dropdownOpened,
        finalSelection,
        handleSave,
        handleVehicleReset,
        maker,
        model,
        productNotCompatible,
        savedVehicleGlobal,
        selectedCover,
        selectedFactoryOptions,
        setDropdownOpened,
        setMaker,
        setModel,
        setProductNotCompatible,
        setSavedVehicleGlobal,
        setSelectedCover,
        setSelectedFactoryOptions,
        setStepNumber,
        setStepTitle,
        setVariant,
        setVehicleSelection,
        stepNumber,
        stepTitle,
        variant,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = () => useContext(VehicleContext);
