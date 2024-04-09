'use client';

import { createContext, useCallback, useContext, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { deleteCookie, setCookie } from '@lib/cookies';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import routes from '@lib/routes';

import { STEP_TITLES } from '@components/builder/builder';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [maker, setMaker] = useState(null);
  const [model, setModel] = useState(null);
  const [stepNumber, setStepNumber] = useState(0);
  const [stepTitle, setStepTitle] = useState('');
  const [factoryOption, setFactoryOption] = useState(null);
  const [variant, setVariant] = useState(null);
  const [finalSelection, setFinalSelection] = useState(null);
  const [savedVehicleGlobal, setSavedVehicleGlobal] = useState({
    maker: '',
    model: '',
  });

  const setVehicleSelection = vehicle => {
    setFinalSelection(vehicle);
  };

  const handleVehicleReset = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_VEHICLE);
    deleteCookie(LOCAL_STORAGE_VEHICLE);
    setMaker(null);
    setModel(null);
    setVehicleSelection(null);
    setSavedVehicleGlobal(null);
    setFactoryOption(null);

    const slug = pathname.split('/products/')[1]?.split('/')[0];
    if (slug) {
      router.push(routes.product(slug));
    }
  }, [router, pathname]);

  const handleSave = useCallback(
    (params, reload) => {
      const vehicleString = JSON.stringify({ maker, model, factoryOption });
      localStorage.setItem(LOCAL_STORAGE_VEHICLE, vehicleString);
      setCookie(LOCAL_STORAGE_VEHICLE, vehicleString, 7);

      setSavedVehicleGlobal({ maker, model, factoryOption });

      setVehicleSelection({
        makerName: maker?.name || undefined,
        modelName: model?.name || undefined,
        factoryOption: factoryOption?.name || undefined,
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
    [maker, model, variant, factoryOption, router],
  );

  return (
    <VehicleContext.Provider
      value={{
        finalSelection,
        setVehicleSelection,
        savedVehicleGlobal,
        setSavedVehicleGlobal,
        maker,
        setMaker,
        model,
        setModel,
        variant,
        setVariant,
        dropdownOpened,
        setDropdownOpened,
        handleVehicleReset,
        handleSave,
        factoryOption,
        setFactoryOption,
        stepNumber,
        setStepNumber,
        stepTitle,
        setStepTitle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = () => useContext(VehicleContext);
