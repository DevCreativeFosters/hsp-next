'use client';

import { createContext, useContext } from 'react';

const GravityFormsStaticDataContext = createContext();

export const GravityFormsStaticDataProvider = ({
  productSubCategories,
  stores,
  children,
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
