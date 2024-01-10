'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useVehicleContext } from '@contexts/vehicle';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { setCookie } from '@lib/cookies';
import { getValueOrSlug } from '@lib/helpers';
import routes from '@lib/routes';
import constants from '@lib/constants';

export default function BreadcrumbsProduct({ currentProduct, categories }) {
  const [currentSavedVehicle, setCurrentSavedVehicle] = useState({});
  const [maker, setMaker] = useState(currentProduct.make || {});
  const [model, setModel] = useState(currentProduct.model || {});
  const [currentMakeList, setCurrentMakeList] = useState([]);
  const [currentModelList, setCurrentModelList] = useState([]);
  const [route, setRoute] = useState('');
  const [applyRoute, setApplyRoute] = useState(undefined);
  const [updateVehicleSelected, setUpdateVehicleSelected] = useState(false);
  const [vehicleNotMatching, setVehicleNotMatching] = useState(false);
  const [displaySelectButton, setDisplaySelectButton] = useState(false);
  const [displayApplyButton, setDisplayApplyButton] = useState(false);
  const [
    isChangeProductPageButtonVisible,
    setIsChangeProductPageButtonVisible,
  ] = useState(false);
  const isFirstLoad = useRef(true);
  const pathname = usePathname();
  const router = useRouter();
  const {
    setSavedVehicleGlobal,
    savedVehicleGlobal,
    finalSelection,
    setVehicleSelection,
  } = useVehicleContext();

  useEffect(
    function loadSavedVehicleFromLocalStorage() {
      const savedVehicle = localStorage.getItem(
        constants.LOCAL_STORAGE_VEHICLE,
      );
      if (savedVehicle) {
        setCurrentSavedVehicle(JSON.parse(savedVehicle));
      }
    },
    [savedVehicleGlobal, finalSelection],
  );

  useEffect(
    function conditionalLogicForButtonVisibility() {
      const productRoute = routes.product(
        currentProduct.mainCategory.value,
        getValueOrSlug(maker),
        getValueOrSlug(model),
      );

      const isVehicleMatch =
        getValueOrSlug(currentSavedVehicle?.maker) ===
          (getValueOrSlug(maker) || undefined) &&
        getValueOrSlug(currentSavedVehicle?.model) ===
          (getValueOrSlug(model) || undefined);

      if (pathname === productRoute) {
        if (isVehicleMatch) {
          setDisplaySelectButton(false);
          setDisplayApplyButton(false);
        } else {
          setDisplaySelectButton(false);
          setDisplayApplyButton(false);
        }
      } else if (pathname !== productRoute) {
        if (isVehicleMatch) {
          setDisplaySelectButton(false);
          setDisplayApplyButton(false);
        } else {
          setDisplaySelectButton(true);
          setDisplayApplyButton(true);
        }
      }
    },
    [
      currentSavedVehicle,
      currentProduct,
      maker,
      model,
      pathname,
      vehicleNotMatching,
      updateVehicleSelected,
    ],
  );

  useEffect(() => {
    const savedMake = getValueOrSlug(currentSavedVehicle?.maker);
    const savedModel = getValueOrSlug(currentSavedVehicle?.model);
    const currentMake = getValueOrSlug(maker);
    const currentModel = getValueOrSlug(model);

    const route = routes.product(
      currentProduct.mainCategory.value,
      savedMake,
      savedModel,
    );

    if (savedMake !== undefined || savedModel !== undefined) {
      if (pathname === route) {
        if (savedMake === currentMake && savedModel === currentModel) {
          setIsChangeProductPageButtonVisible(false);
        } else if (savedMake !== currentMake || savedModel !== currentModel) {
          setIsChangeProductPageButtonVisible(false);
        }
      } else {
        if (savedMake === currentMake && savedModel === currentModel) {
          setIsChangeProductPageButtonVisible(true);
        } else if (savedMake !== currentMake || savedModel !== currentModel) {
          setIsChangeProductPageButtonVisible(true);
        } else {
          setIsChangeProductPageButtonVisible(false);
        }
      }
    }
  }, [pathname, currentProduct, currentSavedVehicle, maker, model]);

  const applyChangedVehicle = useCallback(
    changeVehicle => {
      let selectedMakeObj = {};
      let selectedModelObj = {};

      const selectedMake = getValueOrSlug(maker);
      const selectedModel = getValueOrSlug(model);

      currentMakeList.forEach(carMaker => {
        if (carMaker.value === selectedMake) {
          selectedMakeObj = carMaker;
        }
      });

      currentModelList.forEach(carModel => {
        if (carModel.value === selectedModel) {
          selectedModelObj = carModel;
        }
      });

      const savedVehicle = JSON.stringify({
        maker: selectedMakeObj ? selectedMakeObj : undefined,
        model: selectedModelObj ? selectedModelObj : undefined,
      });

      setSavedVehicleGlobal({
        maker: selectedMakeObj ? selectedMakeObj : undefined,
        model: selectedModelObj ? selectedModelObj : undefined,
      });

      if (changeVehicle) {
        localStorage.setItem(constants.LOCAL_STORAGE_VEHICLE, savedVehicle);
        setCookie(constants.LOCAL_STORAGE_VEHICLE, savedVehicle, 7);
        setVehicleSelection({
          makerName:
            selectedMakeObj?.name || selectedMakeObj?.label || undefined,
          modelName:
            selectedModelObj?.name || selectedModelObj?.label || undefined,
        });
      }

      const route = routes.product(
        currentProduct.mainCategory.value,
        selectedMake,
        selectedModel,
      );

      router.push(route);
    },
    [
      currentMakeList,
      currentModelList,
      maker,
      model,
      setSavedVehicleGlobal,
      setVehicleSelection,
      currentProduct,
      router,
    ],
  );

  const handleMakeSelect = newMake => {
    const makeObj = currentMakeList.find(make => make.value === newMake);

    setMaker({
      label: makeObj ? makeObj.label : undefined,
      slug: makeObj ? getValueOrSlug(makeObj) : undefined,
    });

    setModel({
      label: '',
      slug: '',
    });

    const route = routes.product(
      currentProduct.mainCategory.value,
      makeObj ? getValueOrSlug(makeObj) : undefined,
    );

    setApplyRoute(route);
  };

  const handleModelSelect = newModel => {
    const modelObj = currentModelList.find(model => {
      if (newModel === model.value) {
        return {
          label: model.label,
          slug: model.value,
        };
      }
    });

    setModel({
      label: modelObj.label,
      value: getValueOrSlug(modelObj),
    });

    const route = routes.product(
      currentProduct.mainCategory.value,
      getValueOrSlug(maker),
      getValueOrSlug(modelObj),
    );

    setApplyRoute(route);
  };

  useEffect(
    function checkIfStoredVehicleMatchesSelectedVehicle() {
      const storedVehicle = JSON.parse(
        localStorage.getItem(constants.LOCAL_STORAGE_VEHICLE),
      );

      const makeAndModelSelected =
        getValueOrSlug(maker) && getValueOrSlug(model);

      const matchesStoredVehicle =
        storedVehicle &&
        getValueOrSlug(storedVehicle?.maker) === getValueOrSlug(maker) &&
        getValueOrSlug(storedVehicle?.model) === getValueOrSlug(model);

      setVehicleNotMatching(makeAndModelSelected && !matchesStoredVehicle);
    },
    [maker, model, savedVehicleGlobal],
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
        .reduce(
          (accumulator, category) => accumulator.concat(category.makes),
          [],
        )
        .map(makeObj => ({
          label: makeObj.make,
          value: makeObj.make.toLowerCase(),
        }))
        .filter(
          (make, index, self) =>
            index === self.findIndex(obj => obj.value === make.value),
        );

      setCurrentMakeList(makesList);

      const modelList = categories
        .reduce((accumulator, category) => {
          const foundMake = category.makes.find(
            make => make.make.toLowerCase() === getValueOrSlug(maker),
          );
          if (foundMake) {
            accumulator.push(...foundMake.models);
          }
          return accumulator;
        }, [])
        .map(modelObj => {
          return {
            label: modelObj.label,
            value: modelObj.value?.toLowerCase(),
          };
        })
        .filter(
          (model, index, self) =>
            self.findIndex(obj => obj.value === model.value) === index,
        );

      setCurrentModelList(modelList);
    },
    [categories, maker],
  );

  useEffect(
    function setProductRoute() {
      const selectedMake = getValueOrSlug(maker);
      const selectedModel = getValueOrSlug(model);

      if (selectedMake && selectedModel) {
        const productRoute = routes.product(
          currentProduct.mainCategory?.value,
          selectedMake,
          selectedModel,
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
      selectedValue: getValueOrSlug(maker),
      onSelect: newMake => handleMakeSelect(newMake),
      onSelectOpenNext: false,
      options: currentMakeList,
      strong: Boolean(maker),
    },
    {
      type: 'select',
      name: 'model',
      placeholder: 'Choose model',
      disabled: !getValueOrSlug(maker),
      selectedValue: getValueOrSlug(model),
      onSelect: newModel => handleModelSelect(newModel),
      options: currentModelList,
      strong: Boolean(model),
      checkbox: {
        visible: displaySelectButton,
        checkboxLabel: 'Set as my vehicle',
        checked: updateVehicleSelected,
        onChange: () => setUpdateVehicleSelected(!updateVehicleSelected),
      },
    },
    {
      visible: displayApplyButton,
      variant: 'primary',
      label: 'Apply',
      type: 'button',
      skipPrecedingSeparator: true,
      url: applyRoute,
      onClick: () => applyChangedVehicle(updateVehicleSelected),
    },
    {
      visible: isChangeProductPageButtonVisible,
      label: `Change to ${
        currentSavedVehicle?.maker?.name
          ? currentSavedVehicle?.maker?.name
          : '' || currentSavedVehicle?.maker?.label
            ? currentSavedVehicle?.maker?.label
            : ''
      } ${
        currentSavedVehicle?.model?.name
          ? currentSavedVehicle?.model?.name
          : '' || currentSavedVehicle?.model?.label
            ? currentSavedVehicle?.model?.label
            : ''
      }`,
      type: 'button',
      skipPrecedingSeparator: true,
      url: routes.product(
        currentProduct.mainCategory.value,
        getValueOrSlug(currentSavedVehicle?.maker),
        getValueOrSlug(currentSavedVehicle?.model),
      ),
    },
  ];

  return <Breadcrumbs items={items} product />;
}
