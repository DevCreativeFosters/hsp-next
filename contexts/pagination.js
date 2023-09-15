'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const PaginationContext = createContext({});

export const PaginationContextProvider = ({ children }) => {
  const [value, setValue] = useState({});
  return (
    <PaginationContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export function usePaginationContext(scopeKey) {
  const ctx = useContext(PaginationContext);
  const { value, setValue } = ctx;

  useEffect(function () {
    setValue(currentValue => {
      const obj = {};
      obj[scopeKey] = 1;
      return { ...currentValue, ...obj };
    });
  }, []);

  return ctx;
}
