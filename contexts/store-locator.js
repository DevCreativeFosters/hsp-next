'use client';

import { createContext, useState } from 'react';

const StoreLocatorContext = createContext({});

export const StoreLocatorProvider = ({ children }) => {
  const [location, setLocation] = useState(undefined);
  const [searchGeolocation, setSearchGeolocation] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isMapVisible, setMapVisible] = useState(false);

  return (
    <StoreLocatorContext.Provider
      value={{
        filteredLocations,
        filteredStores,
        isMapVisible,
        location,
        searchGeolocation,
        selectedStore,
        setFilteredLocations,
        setFilteredStores,
        setLocation,
        setMapVisible,
        setSearchGeolocation,
        setSelectedStore,
      }}
    >
      {children}
    </StoreLocatorContext.Provider>
  );
};

export default StoreLocatorContext;
