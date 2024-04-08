'use client';

import { useEffect, useMemo, useState } from 'react';

import { useVehicleContext } from '@contexts/vehicle';

import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';
import normalizeUteBuilderProducts from '@lib/normalize-ute-builder-products';

import Builder from '@components/builder/builder';
import Container from '@components/container/container';
import Loading from '@components/loading/loading';
import PageContainer from '@components/page-container/page-container';

export default function UteBuilderPage({
  makes,
  allLocations,
  factoryOptions,
  globalOptions,
  noCover,
}) {
  const [loaded, setLoaded] = useState(false);
  const [make, setMake] = useState(null);
  const [model, setModel] = useState(null);
  const [productVariants, setProductVariants] = useState(null);
  const [factoryOption, setFactoryOption] = useState(null);
  const { finalSelection, savedVehicleGlobal } = useVehicleContext();

  useEffect(() => {
    const fetchData = async (model, make) => {
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

        fetchData(model, maker);
      }
    } else {
      setMake(null);
      setModel(null);
      setProductVariants(null);
    }

    setLoaded(true);
  }, [finalSelection, savedVehicleGlobal]);

  const variantList = useMemo(() => {
    return normalizeUteBuilderProducts(productVariants);
  }, [productVariants]);

  if (loaded) {
    return (
      <Builder
        make={make}
        model={model}
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

  return (
    <Container>
      <PageContainer>
        <Loading />
      </PageContainer>
    </Container>
  );
}
