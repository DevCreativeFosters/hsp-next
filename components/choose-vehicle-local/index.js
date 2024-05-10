'use client';

import { useCallback, useEffect, useState } from 'react';

import { getModelsByMakeSlug } from '@lib/api/get-models-by-make-slug';
import { getProductsByCategoriesSlugs } from '@lib/api/get-products-by-categories-slugs';

import Button from '@components/button/button';

export default function ChooseVehicleLocal({ mainCategorySlug, makes }) {
  const [makeSlug, setMakeSlug] = useState(null);
  const [modelSlug, setModelSlug] = useState(null);
  const [modelList, setModelList] = useState([]);
  const [variantsList, setVariantsList] = useState([]);

  const handleMakeChange = useCallback(event => {
    event.preventDefault();

    setMakeSlug(event.currentTarget.value);
  }, []);

  const handleModelChange = useCallback(event => {
    event.preventDefault();

    setModelSlug(event.currentTarget.value);
  }, []);

  const fetchVariantsByCategories = useCallback(async () => {
    const products = await getProductsByCategoriesSlugs(
      mainCategorySlug,
      makeSlug,
      modelSlug,
    );

    const firstMatch = products?.length ? products[0] : null;

    if (firstMatch) {
      setVariantsList(firstMatch.productFields?.variants);
    } else {
      setVariantsList([]);
    }
  }, [mainCategorySlug, makeSlug, modelSlug]);

  const fetchModelsByMake = useCallback(async () => {
    const modelsList = await getModelsByMakeSlug(makeSlug);

    setModelList(modelsList);
  }, [makeSlug]);

  useEffect(
    function fetchModels() {
      if (makeSlug) {
        fetchModelsByMake();
      } else {
        setModelList([]);
      }
    },
    [fetchModelsByMake, makeSlug],
  );

  useEffect(
    function fetchVariants() {
      if (modelSlug) {
        fetchVariantsByCategories();
      }
    },
    [fetchVariantsByCategories, modelSlug],
  );

  return (
    <div>
      <div>
        <h2>Make</h2>
        <select onChange={handleMakeChange}>
          <option value="">Choose Make</option>
          {makes.map(({ databaseId, name, slug }) => (
            <option key={databaseId} value={slug}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h2>Model</h2>
        <select
          disabled={!(makeSlug && modelList.length)}
          onChange={handleModelChange}
        >
          <option value="">Choose Model</option>
          {modelList.map(({ databaseId, name, slug }) => (
            <option key={databaseId} value={slug}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2>Variant</h2>
        <select disabled={!(makeSlug && modelSlug && variantsList.length)}>
          <option value="">Choose Variant</option>
          {variantsList.map(({ productName, variantSlug }, index) => (
            <option key={index} value={variantSlug}>
              {productName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Button>See details</Button>
      </div>
    </div>
  );
}
