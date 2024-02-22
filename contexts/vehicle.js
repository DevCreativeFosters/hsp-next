'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { setCookie, deleteCookie } from '@lib/cookies';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import routes from '@lib/routes';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [maker, setMaker] = useState(null);
  const [model, setModel] = useState(null);
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

    const slug = pathname.split('/products/')[1]?.split('/')[0];
    if (slug) {
      router.push(routes.product(slug));
    }
  }, [router, pathname]);

  const handleSave = useCallback(() => {
    const vehicleString = JSON.stringify({ maker, model });
    localStorage.setItem(LOCAL_STORAGE_VEHICLE, vehicleString);
    setCookie(LOCAL_STORAGE_VEHICLE, vehicleString, 7);

    setSavedVehicleGlobal({ maker, model });
    setVehicleSelection({
      makerName: maker?.name || undefined,
      modelName: model?.name || undefined,
    });
    setDropdownOpened(false);
  }, [maker, model]);

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
        dropdownOpened,
        setDropdownOpened,
        handleVehicleReset,
        handleSave,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = () => useContext(VehicleContext);
