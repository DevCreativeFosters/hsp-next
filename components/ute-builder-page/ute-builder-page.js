'use client';

import { useEffect, useState } from 'react';

import { useVehicleContext } from '@contexts/vehicle';

import getModelWithVariants from '@lib/api/get-model-with-variants';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';

import Builder from '@components/builder/builder';

export default function UteBuilderPage({
  allLocations,
  excludedCategories,
  factoryOptions,
  globalOptions,
  makes,
  noCover,
}) {
  const [productVariants, setProductVariants] = useState([]);

  const {
    finalSelection,
    savedVehicleGlobal,
    selectedFactoryOptions,
    setMaker: setMake,
    setModel,
    setSelectedFactoryOptions,
  } = useVehicleContext();

  useEffect(
    function saveUserSelection() {
      const savedVehicle = localStorage.getItem(LOCAL_STORAGE_VEHICLE);

      if (finalSelection) {
        if (savedVehicle) {
          const vehicle = JSON.parse(savedVehicle);
          const modelSlug = vehicle?.model?.value || vehicle?.model?.slug;
          const makerSlug = vehicle?.maker?.value || vehicle?.maker?.slug;
          const selectedFactoryOptions =
            vehicle?.selectedFactoryOptions || null;
          const excludedCategoriesString = excludedCategories.join(',');

          setMake(vehicle?.maker);
          setModel(vehicle?.model);
          setSelectedFactoryOptions(selectedFactoryOptions);

          const response = getModelWithVariants(
            modelSlug,
            makerSlug,
            excludedCategoriesString,
          );

          response.then(data => {
            setModel(data?.modelData);
            setProductVariants(data?.productData);
          });
        }
      } else {
        setMake(null);
        setModel(null);
        setProductVariants(null);
      }
    },
    [
      excludedCategories,
      finalSelection,
      savedVehicleGlobal,
      setMake,
      setModel,
      setSelectedFactoryOptions,
    ],
  );

  return (
    <Builder
      allLocations={allLocations}
      factoryOption={selectedFactoryOptions}
      factoryOptions={factoryOptions}
      globalOptions={globalOptions}
      makes={makes}
      noCover={noCover}
      products={productVariants}
    />
  );
}
