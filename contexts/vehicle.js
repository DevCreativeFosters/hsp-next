'use client';

import { createContext, useContext, useState } from 'react';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [finalSelection, setFinalSelection] = useState(null);
  const [savedVehicleGlobal, setSavedVehicleGlobal] = useState({
    maker: '',
    model: '',
  });

  const setVehicleSelection = vehicle => {
    setFinalSelection(vehicle);
  };

  return (
    <VehicleContext.Provider
      value={{
        finalSelection,
        setVehicleSelection,
        savedVehicleGlobal,
        setSavedVehicleGlobal,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = () => useContext(VehicleContext);
