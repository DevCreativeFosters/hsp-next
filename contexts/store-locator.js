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
  const [isInlineResultListVisible, setInlineResultListVisible] =
    useState(false);
  const [showLocationError, setShowLocationError] = useState(false);

  return (
    <StoreLocatorContext.Provider
      value={{
        filteredLocations,
        filteredStores,
        isInlineResultListVisible,
        isMapVisible,
        location,
        searchGeolocation,
        selectedStore,
        setFilteredLocations,
        setFilteredStores,
        setInlineResultListVisible,
        setLocation,
        setMapVisible,
        setSearchGeolocation,
        setSelectedStore,
        setShowLocationError,
        showLocationError,
      }}
    >
      {children}
    </StoreLocatorContext.Provider>
  );
};

export default StoreLocatorContext;
