'use client';

import { useState, createContext } from 'react';

const StoreLocatorContext = createContext({});

export const RADIUS_OPTIONS = [
  { value: 10 },
  { value: 25 },
  { value: 50 },
  { value: 100 },
  { value: 500 },
  { value: 1500 },
  { value: 3000 },
]; // [km]

export const DEFAULT_RADIUS = RADIUS_OPTIONS[RADIUS_OPTIONS.length - 1].value;

export const StoreLocatorProvider = ({ children }) => {
  const [location, setLocation] = useState(undefined);
  const [searchGeolocation, setSearchGeolocation] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
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
        radius,
        setRadius,
        selectedStore,
        setSelectedStore,
        isMapVisible,
        setMapVisible,
      }}
    >
      {children}
    </StoreLocatorContext.Provider>
  );
};

export default StoreLocatorContext;
