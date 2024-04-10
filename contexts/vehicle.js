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
  const [selectedCover, setSelectedCover] = useState(null);
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
    setStepNumber(0);
    setStepTitle('');

    const slug = pathname.split('/products/')[1]?.split('/')[0];
    if (slug) {
      router.push(routes.product(slug));
    }
  }, [pathname, router]);

  const handleSave = useCallback(
    (params, reload) => {
      const vehicleString = JSON.stringify({ factoryOption, maker, model });
      localStorage.setItem(LOCAL_STORAGE_VEHICLE, vehicleString);
      setCookie(LOCAL_STORAGE_VEHICLE, vehicleString, 7);

      setSavedVehicleGlobal({ factoryOption, maker, model });

      setVehicleSelection({
        factoryOption: factoryOption?.name || undefined,
        makerName: maker?.name || undefined,
        modelName: model?.name || undefined,
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
    [factoryOption, maker, model, router, variant],
  );

  return (
    <VehicleContext.Provider
      value={{
        dropdownOpened,
        factoryOption,
        finalSelection,
        handleSave,
        handleVehicleReset,
        maker,
        model,
        savedVehicleGlobal,
        selectedCover,
        setDropdownOpened,
        setFactoryOption,
        setMaker,
        setModel,
        setSavedVehicleGlobal,
        setSelectedCover,
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
