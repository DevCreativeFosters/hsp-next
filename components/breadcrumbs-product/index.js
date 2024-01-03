'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useVehicleContext } from '@contexts/vehicle';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import { setCookie } from '@lib/cookies';
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
  const { setSavedVehicleGlobal, savedVehicleGlobal, finalSelection } =
    useVehicleContext();

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
        maker?.value,
        model?.value,
      );

      const isVehicleMatch =
        currentSavedVehicle?.maker?.value === maker.value &&
        currentSavedVehicle?.model?.value ===
          (model.value !== '' ? model.value : undefined);

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
    const savedMake = currentSavedVehicle?.maker?.value;
    const savedModel = currentSavedVehicle?.model?.value;
    const route = routes.product(
      currentProduct.mainCategory.value,
      currentSavedVehicle?.maker?.value,
      currentSavedVehicle?.model?.value,
    );

    const buttonVisibility =
      pathname === route
        ? false
        : savedMake !== undefined || savedModel !== undefined
        ? savedMake === maker.value && savedModel === model.value
        : false;

    if (savedMake !== undefined || savedModel !== undefined) {
      if (pathname === route) {
        if (savedMake === maker.value && savedModel === model.value) {
          setIsChangeProductPageButtonVisible(false);
        } else if (savedMake !== maker.value || savedModel !== model.value) {
          setIsChangeProductPageButtonVisible(false);
        }
      } else {
        if (savedMake === maker.value && savedModel === model.value) {
          setIsChangeProductPageButtonVisible(true);
        } else if (savedMake !== maker.value || savedModel !== model.value) {
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
      }

      const route = routes.product(
        currentProduct.mainCategory.value,
        maker?.value,
        model?.value,
      );

      router.push(route);
    },
    [
      currentMakeList,
      currentModelList,
      maker,
      model,
      setSavedVehicleGlobal,
      currentProduct,
      router,
    ],
  );

  const handleMakeSelect = newMake => {
    const makeObj = currentMakeList.find(make => make.value === newMake);

    setMaker({
      label: makeObj ? makeObj.label : undefined,
      value: makeObj ? makeObj.value : undefined,
    });

    setModel({
      label: '',
      value: '',
    });

    const route = routes.product(
      currentProduct.mainCategory.value,
      makeObj ? makeObj.value : undefined,
    );

    setApplyRoute(route);
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

    const route = routes.product(
      currentProduct.mainCategory.value,
      maker?.value,
      modelObj.value,
    );

    setApplyRoute(route);
  };

  useEffect(
    function checkIfStoredVehicleMatchesSelectedVehicle() {
      const storedVehicle = JSON.parse(
        localStorage.getItem(constants.LOCAL_STORAGE_VEHICLE),
      );

      const makeAndModelSelected = maker?.value && model?.value;

      const matchesStoredVehicle =
        storedVehicle &&
        storedVehicle?.maker?.value === maker.value &&
        storedVehicle?.model?.value === model.value;

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
            make => make.make.toLowerCase() === maker.value,
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
    [categories, maker.value],
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
        currentSavedVehicle?.maker?.value,
        currentSavedVehicle?.model?.value,
      ),
    },
  ];

  return <Breadcrumbs items={items} product />;
}
