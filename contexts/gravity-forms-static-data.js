'use client';

import { createContext, useContext } from 'react';

const GravityFormsStaticDataContext = createContext();

export const GravityFormsStaticDataProvider = ({
  children,
  productSubCategories,
  stores,
}) => {
  return (
    <GravityFormsStaticDataContext.Provider
      value={{
        productSubCategories,
        stores,
      }}
    >
      {children}
    </GravityFormsStaticDataContext.Provider>
  );
};

export const useGravityFormsStaticData = () =>
  useContext(GravityFormsStaticDataContext);
