'use client';

import { useEffect, useMemo, useState } from 'react';

import { useVehicleContext } from '@contexts/vehicle';

import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import normalizeUteBuilderProducts from '@lib/normalize-ute-builder-products';

import Builder from '@components/builder/builder';

export default function UteBuilderPage({
  allLocations,
  factoryOptions,
  globalOptions,
  makes,
  noCover,
}) {
  const [productVariants, setProductVariants] = useState(null);

  const {
    factoryOption,
    finalSelection,
    savedVehicleGlobal,
    setFactoryOption,
    setMaker: setMake,
    setModel,
  } = useVehicleContext();

  useEffect(() => {
    const setModelAndProducts = async (model, make) => {
      const response = await fetch(
        `/api/ute-builder?model=${model}&make=${make}`,
      );
      const data = await response.json();
      setModel(data?.modelData);
      setProductVariants(data?.productData);
    };

    const savedVehicle = localStorage.getItem(LOCAL_STORAGE_VEHICLE);

    if (finalSelection) {
      if (savedVehicle) {
        const vehicle = JSON.parse(savedVehicle);
        const model = vehicle?.model?.value || vehicle?.model?.slug;
        const maker = vehicle?.maker?.value || vehicle?.maker?.slug;
        const factoryOption = vehicle?.factoryOption || null;
        setMake(vehicle?.maker);
        setFactoryOption(factoryOption);

        setModelAndProducts(model, maker);
      }
    } else {
      setMake(null);
      setModel(null);
      setProductVariants(null);
    }
  }, [finalSelection, savedVehicleGlobal, setFactoryOption, setMake, setModel]);

  const variantList = useMemo(() => {
    return normalizeUteBuilderProducts(productVariants);
  }, [productVariants]);

  return (
    <Builder
      allLocations={allLocations}
      factoryOption={factoryOption}
      factoryOptions={factoryOptions}
      globalOptions={globalOptions}
      makes={makes}
      noCover={noCover}
      products={variantList}
    />
  );
}
