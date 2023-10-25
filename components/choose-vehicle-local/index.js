'use client';

import Button from '@components/button/button';
import { getModelsByMakeSlug, getProductsByCategoriesSlugs } from '@lib/api';
import { useCallback, useEffect, useState } from 'react';

// Example component

export default function ChooseVehicleLocal({ mainCategorySlug, makes }) {
  const [makeSlug, setMakeSlug] = useState(null);
  const [modelSlug, setModelSlug] = useState(null);
  const [modelList, setModelList] = useState([]);
  const [variantsList, setVariantsList] = useState([]);

  const handleMakeChange = useCallback(ev => {
    ev.preventDefault;

    setMakeSlug(ev.currentTarget.value);
  }, []);

  const handleModelChange = useCallback(ev => {
    ev.preventDefault;

    setModelSlug(ev.currentTarget.value);
  }, []);

  const fetchVariantsByCategories = useCallback(async () => {
    const products = await getProductsByCategoriesSlugs(
      mainCategorySlug,
      makeSlug,
      modelSlug,
    );
    const firstMatch = products.length ? products[0] : null;

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
    [makeSlug, fetchModelsByMake],
  );

  useEffect(
    function fetchVariants() {
      if (modelSlug) {
        fetchVariantsByCategories();
      }
    },
    [modelSlug, fetchVariantsByCategories],
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
          disabled={makeSlug && modelList.length ? false : true}
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
        <select
          disabled={makeSlug && modelSlug && variantsList.length ? false : true}
        >
          <option value="">Choose Variant</option>
          {variantsList.map(({ variantName, variantSlug }, index) => (
            <option key={index} value={variantSlug}>
              {variantName}
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
