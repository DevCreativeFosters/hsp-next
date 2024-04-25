'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const PaginationContext = createContext({});

export const PaginationContextProvider = ({ children }) => {
  const [value, setValue] = useState({});
  return (
    <PaginationContext.Provider
      value={{
        setValue,
        value,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export function usePaginationContext(scopeKey) {
  const ctx = useContext(PaginationContext);
  const { setValue, value } = ctx;

  useEffect(function () {
    setValue(currentValue => {
      const obj = {};
      obj[scopeKey] = 1;
      return { ...currentValue, ...obj };
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ctx;
}
