'use client';

import { useCallback, useEffect, useState } from 'react';

import { getModelsByMakeSlug } from '@lib/api/get-models-by-make-slug';

import Button from '@components/button/button';

// Example component

export default function ChooseVehicleGlobal({ makes }) {
  const [makeSlug, setMakeSlug] = useState(null);
  const [modelSlug, setModelSlug] = useState(null);
  const [modelList, setModelList] = useState([]);

  const handleMakeChange = useCallback(ev => {
    ev.preventDefault;

    setMakeSlug(ev.currentTarget.value);
  }, []);

  const handleModelChange = useCallback(ev => {
    ev.preventDefault;

    setModelSlug(ev.currentTarget.value);
  }, []);

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
        <Button>Save</Button>
      </div>
    </div>
  );
}
