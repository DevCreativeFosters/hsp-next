'use client';

import { useState, createContext } from 'react';

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
        searchGeolocation,
        setSearchGeolocation,
        location,
        setLocation,
        filteredLocations,
        setFilteredLocations,
        selectedStore,
        setSelectedStore,
        isMapVisible,
        setMapVisible,
        filteredStores,
        setFilteredStores,
      }}
    >
      {children}
    </StoreLocatorContext.Provider>
  );
};

export default StoreLocatorContext;
