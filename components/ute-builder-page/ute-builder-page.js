'use client';

import { useEffect, useMemo, useState } from 'react';

import { useVehicleContext } from '@contexts/vehicle';

import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import normalizeUteBuilderProducts from '@lib/normalize-ute-builder-products';

import Builder from '@components/builder/builder';

export default function UteBuilderPage({
  makes,
  allLocations,
  factoryOptions,
  globalOptions,
  noCover,
}) {
  const [productVariants, setProductVariants] = useState(null);

  const {
    finalSelection,
    savedVehicleGlobal,
    setModel,
    setMaker: setMake,
    factoryOption,
    setFactoryOption,
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
  }, [finalSelection, savedVehicleGlobal]);

  const variantList = useMemo(() => {
    return normalizeUteBuilderProducts(productVariants);
  }, [productVariants]);

  return (
    <Builder
      makes={makes}
      products={variantList}
      allLocations={allLocations}
      factoryOptions={factoryOptions}
      factoryOption={factoryOption}
      globalOptions={globalOptions}
      noCover={noCover}
    />
  );
}
