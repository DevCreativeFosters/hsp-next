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
];

export const DEFAULT_RADIUS = RADIUS_OPTIONS[RADIUS_OPTIONS.length - 1].value;

export const StoreLocatorProvider = ({ children }) => {
  const [searchGeolocation, setSearchGeolocation] = useState(null);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  return (
    <StoreLocatorContext.Provider
      value={{
        searchGeolocation,
        setSearchGeolocation,
        radius,
        setRadius,
      }}
    >
      {children}
    </StoreLocatorContext.Provider>
  );
};

export default StoreLocatorContext;
