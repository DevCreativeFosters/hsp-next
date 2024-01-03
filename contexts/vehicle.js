'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { setCookie, deleteCookie } from '@lib/cookies';
import constants from '@lib/constants';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
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
    localStorage.removeItem(constants.LOCAL_STORAGE_VEHICLE);
    deleteCookie(constants.LOCAL_STORAGE_VEHICLE);
    setMaker(null);
    setModel(null);
    setVehicleSelection(null);
    setSavedVehicleGlobal(null);
  }, []);

  const handleSave = useCallback(() => {
    const vehicleString = JSON.stringify({ maker, model });
    localStorage.setItem(constants.LOCAL_STORAGE_VEHICLE, vehicleString);
    setCookie(constants.LOCAL_STORAGE_VEHICLE, vehicleString, 7);

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
