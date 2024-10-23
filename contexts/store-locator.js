'use client';

import { createContext, useState } from 'react';

const StoreLocatorContext = createContext({});

export const StoreLocatorProvider = ({ children }) => {
  const [location, setLocation] = useState(undefined);
  const [locationInput, setLocationInput] = useState('');
  const [searchGeolocation, setSearchGeolocation] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isMapVisible, setMapVisible] = useState(false);
  const [isInlineResultListVisible, setInlineResultListVisible] =
    useState(false);
  const [showLocationError, setShowLocationError] = useState(false);
  const [productsSectionOpen, setProductsSectionOpen] = useState(true);
  const [allMapLocations, setAllMapLocations] = useState([]);

  return (
    <StoreLocatorContext.Provider
      value={{
        allMapLocations,
        filteredLocations,
        filteredStores,
        isInlineResultListVisible,
        isMapVisible,
        location,
        locationInput,
        productsSectionOpen,
        searchGeolocation,
        selectedStore,
        setAllMapLocations,
        setFilteredLocations,
        setFilteredStores,
        setInlineResultListVisible,
        setLocation,
        setLocationInput,
        setMapVisible,
        setProductsSectionOpen,
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
