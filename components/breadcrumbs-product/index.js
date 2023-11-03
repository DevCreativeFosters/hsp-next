'use client';

import { useEffect, useState, useRef } from 'react';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import routes from '@lib/routes';

export default function BreadcrumbsProduct({ currentProduct, categories }) {
  const [maker, setMaker] = useState(currentProduct.make.value);
  const [model, setModel] = useState(currentProduct.model.value);
  const [currentMakeList, setCurrentMakeList] = useState([]);
  const [currentModelList, setCurrentModelList] = useState([]);
  const [route, setRoute] = useState('');
  const isFirstLoad = useRef(true);

  const handleMakeSelect = newMake => {
    setMaker(newMake);
    setModel('');
  };

  useEffect(
    function clearModelListOnMakeChange() {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return;
      }
    },
    [maker, route],
  );

  useEffect(() => {
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
        make => make.make.toLowerCase() === maker,
      );
      if (foundMake) {
        return [...accumulator, ...foundMake.models];
      }
      return accumulator;
    }, []);

    const route = routes.product(
      currentProduct.mainCategory?.value,
      maker,
      model,
    );
    setRoute(route);

    setCurrentModelList(modelList);
  }, [
    maker,
    model,
    currentProduct.mainCategory.value,
    categories,
    currentProduct,
  ]);

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
      selectedValue: maker,
      onSelect: newMake => handleMakeSelect(newMake),
      onSelectOpenNext: false,
      options: currentMakeList,
      strong: Boolean(maker),
    },
    {
      type: 'select',
      name: 'model',
      placeholder: 'Choose model',
      disabled: !maker,
      selectedValue: model,
      onSelect: setModel,
      options: currentModelList,
      strong: Boolean(model),
    },
    {
      label: 'Apply',
      type: 'button',
      skipPrecedingSeparator: true,
      url: route,
      onClick: () => {
        localStorage.setItem(
          'hsp-my-vehicle',
          JSON.stringify({ make: maker, model: model }),
        );
      },
    },
  ];

  return <Breadcrumbs items={items} />;
}
