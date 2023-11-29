'use client';

import { useEffect, useState, useRef } from 'react';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { setCookie } from '@lib/cookies';
import routes from '@lib/routes';

const LOCAL_STORAGE_VEHICLE = 'hsp-my-vehicle';

export default function BreadcrumbsProduct({ currentProduct, categories }) {
  const [maker, setMaker] = useState(currentProduct.make || {});
  const [model, setModel] = useState(currentProduct.model || {});
  const [currentMakeList, setCurrentMakeList] = useState([]);
  const [currentModelList, setCurrentModelList] = useState([]);
  const [route, setRoute] = useState('');
  const [updateVehicleSelected, setUpdateVehicleSelected] = useState(false);
  const [vehicleNotMatching, setVehicleNotMatching] = useState(false);
  const isFirstLoad = useRef(true);

  const applyChangedVehicle = () => {
    let selectedMakeObj = {};
    let selectedModelObj = {};

    currentMakeList.forEach(carMaker => {
      if (carMaker.value === maker.value) {
        selectedMakeObj = carMaker;
      }
    });

    currentModelList.forEach(carModel => {
      if (carModel.value === model.value) {
        selectedModelObj = carModel;
      }
    });

    const savedVehicle = JSON.stringify({
      maker: selectedMakeObj ? selectedMakeObj : '',
      model: selectedModelObj ? selectedModelObj : '',
    });

    localStorage.setItem(LOCAL_STORAGE_VEHICLE, savedVehicle);

    setCookie(LOCAL_STORAGE_VEHICLE, savedVehicle, 7);
  };

  const handleMakeSelect = newMake => {
    const makeObj = currentMakeList.find(make => {
      if (newMake === make.value) {
        return {
          label: make.label,
          value: make.value,
        };
      }
    });

    setMaker({
      label: makeObj.label,
      value: makeObj.value,
    });
    setModel({});
  };

  const handleModelSelect = newModel => {
    const modelObj = currentModelList.find(model => {
      if (newModel === model.value) {
        return {
          label: model.label,
          value: model.value,
        };
      }
    });

    setModel({
      label: modelObj.label,
      value: modelObj.value,
    });
  };

  useEffect(
    function checkIfStoredVehicleMatchesSelectedVehicle() {
      const storedVehicle = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_VEHICLE),
      );

      const makeAndModelSelected = maker.value && model.value;

      const matchesStoredVehicle =
        storedVehicle &&
        storedVehicle.maker.value === maker.value &&
        storedVehicle.model.value === model.value;

      setVehicleNotMatching(makeAndModelSelected && !matchesStoredVehicle);
    },
    [maker, model],
  );

  useEffect(
    function clearModelListOnMakeChange() {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return;
      }
    },
    [maker, route],
  );

  useEffect(
    function extractMakeAndModelLists() {
      const makesList = categories
        .reduce((accumulator, category) => {
          return accumulator.concat(category.makes);
        }, [])
        .map(makeObj => {
          return {
            label: makeObj.make,
            value: makeObj.make.toLowerCase(),
          };
        });

      setCurrentMakeList(makesList);

      const modelList = categories.reduce((accumulator, category) => {
        const foundMake = category.makes.find(
          make => make.make.toLowerCase() === maker.value,
        );
        if (foundMake) {
          return [...accumulator, ...foundMake.models];
        }
        return accumulator;
      }, []);

      setCurrentModelList(modelList);
    },
    [
      maker,
      model,
      currentProduct.mainCategory.value,
      categories,
      currentProduct,
    ],
  );

  useEffect(
    function setProductRoute() {
      if (maker.value && model.value) {
        const productRoute = routes.product(
          currentProduct.mainCategory?.value,
          maker.value,
          model.value,
        );
        setRoute(productRoute);
      }
    },
    [maker, model, currentProduct.mainCategory?.value],
  );

  const items = [
    {
      label: 'Products',
      url: routes.products,
    },
    {
      label: currentProduct.mainCategory.label,
      url: routes.product(currentProduct.mainCategory?.value),
      current: true,
    },
    {
      type: 'select',
      name: 'maker',
      placeholder: 'Choose make',
      selectedValue: maker.value,
      onSelect: newMake => handleMakeSelect(newMake),
      onSelectOpenNext: false,
      options: currentMakeList,
      strong: Boolean(maker),
    },
    {
      type: 'select',
      name: 'model',
      placeholder: 'Choose model',
      disabled: !maker.value,
      selectedValue: model.value,
      onSelect: newModel => handleModelSelect(newModel),
      options: currentModelList,
      strong: Boolean(model),
      checkbox: {
        visible: vehicleNotMatching,
        checkboxLabel: 'Set as my vehicle',
        checked: updateVehicleSelected,
        onChange: () => setUpdateVehicleSelected(!updateVehicleSelected),
      },
    },
    {
      label: 'Apply',
      type: 'button',
      disabled: !updateVehicleSelected,
      skipPrecedingSeparator: true,
      url: route,
      onClick: () => applyChangedVehicle(),
    },
  ];

  return <Breadcrumbs items={items} product />;
}
