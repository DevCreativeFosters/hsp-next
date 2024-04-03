'use client';

import { useEffect, useMemo, useState } from 'react';

import { useVehicleContext } from '@contexts/vehicle';

import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';

import Builder from '@components/builder/builder';
import Container from '@components/container/container';
import Loading from '@components/loading/loading';
import PageContainer from '@components/page-container/page-container';

export default function UteBuilderPage({
  makes,
  allLocations,
  factoryOptions,
  uteCovers,
}) {
  const [loaded, setLoaded] = useState(false);
  const [makeName, setMakeName] = useState('');
  const [model, setModel] = useState({});
  const [productVariants, setProductVariants] = useState([]);
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
        setMakeName(vehicle?.maker?.name);
        fetchData(model, maker);
      }
    } else {
      setMakeName('');
      setModel({});
      setProductVariants([]);
    }

    setLoaded(true);
  }, [finalSelection, savedVehicleGlobal]);

  const variantList = useMemo(() => {
    const variants = [];

    productVariants?.forEach(product => {
      if (product.productFields.variants) {
        product.productFields.variants.forEach(productVariant => {
          const parentInherit = productVariant.parentInherit;

          variants.push({
            ...productVariant,
            price:
              productVariant.variantDetails.price ||
              (parentInherit && product.productFields.price),
            installationCost: product.productFields.installationCost,
            productSlug: product.slug,
          });
        });
      }
    });

    return variants;
  }, [productVariants]);

  if (loaded) {
    return (
      <Builder
        makeName={makeName}
        model={model}
        products={variantList}
        allLocations={allLocations}
        uteCovers={uteCovers}
        factoryOptions={factoryOptions}
        makes={makes}
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
