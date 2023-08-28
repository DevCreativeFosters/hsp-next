'use client';

import { useEffect, useState } from 'react';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';

const MAKERS = [
  {
    label: 'Ford',
    value: 'ford',
  },
  {
    label: 'Nissan',
    value: 'nissan',
  },
  {
    label: 'Holden',
    value: 'holden',
  },
  {
    label: 'Toyota',
    value: 'toyota',
  },
  {
    label: 'Isuzu',
    value: 'isuzu',
  },
  {
    label: 'Volkswagen',
    value: 'volkswagen',
  },
  {
    label: 'Mazda',
    value: 'mazda',
  },
  {
    label: 'GWM Haval',
    value: 'gwm-haval',
  },
  {
    label: 'Mercedes-Benz',
    value: 'mercedes-benz',
  },
  {
    label: 'LDV',
    value: 'ldv',
  },
  {
    label: 'Mitsubishi',
    value: 'mitsubishi',
  },
];
const FORD_EXAMPLE_MODELS = [
  {
    label: 'Ranger PX',
    value: 'ranger-px',
  },
  {
    label: 'Falcon FG - FGX',
    value: 'falcon-fg-fgx',
  },
  {
    label: 'Third',
    value: '3',
  },
  {
    label: 'Fourth',
    value: '4',
  },
  {
    label: 'Fifth',
    value: '5',
  },
  {
    label: 'Sixth',
    value: '6',
  },
  { value: '7' },
  { value: '8' },
  { value: '9' },
  { value: '10' },
  {
    label: 'Eleventh very very long name',
    value: '11',
  },
  { value: '12' },
  { value: '13' },
];
const NISSAN_EXAMPLE_MODELS = [
  {
    label: 'Nissan Car Model A',
    value: 'nissan-a',
  },
  {
    label: 'Nissan Model B',
    value: 'nissan-b',
  },
];
const CAR_EXAMPLE_MODELS = [
  {
    label: 'Car Model 1',
    value: 'car-model-1',
  },
  {
    label: 'Car Model 2',
    value: 'car-model-2',
  },
  {
    label: 'Car Model 3',
    value: 'car-model-3',
  },
  {
    label: 'Car Model 4',
    value: 'car-model-4',
  },
  {
    label: 'Car Model 5',
    value: 'car-model-5',
  },
  {
    label: 'Car Model 6',
    value: 'car-model-6',
  },
  {
    label: 'Car Model 7',
    value: 'car-model-7',
  },
  {
    label: 'Car Model 8',
    value: 'car-model-8',
  },
];

export default function BreadcrumbsExample() {
  const [maker, setMaker] = useState(null);
  const [model, setModel] = useState(null);
  const [currentModelList, setCurrentModelList] = useState([]);

  // example explicit synchronisation between breadcrumb items
  // - switch-case should not be a part of final implementation
  useEffect(
    function syncModelList() {
      switch (maker) {
        case 'ford':
          setCurrentModelList(FORD_EXAMPLE_MODELS);
          break;
        case 'nissan':
          setCurrentModelList(NISSAN_EXAMPLE_MODELS);
          break;
        default:
          setCurrentModelList(CAR_EXAMPLE_MODELS);
          break;
      }
      console.log('set model to null');
      setModel(null);
    },
    [maker],
  );

  const items = [
    {
      label: 'Products',
      url: '#',
    },
    {
      label: 'Premium Hard Lid',
      url: '#',
      current: true,
    },
    {
      type: 'select',
      name: 'maker',
      placeholder: 'Choose make',
      selectedValue: maker,
      onSelect: setMaker,
      onSelectOpenNext: true,
      options: MAKERS,
    },
    {
      type: 'select',
      name: 'model',
      placeholder: 'Choose model',
      disabled: !maker,
      selectedValue: model,
      onSelect: setModel,
      options: currentModelList,
    },
    {
      label: 'Go',
      type: 'button',
      disabled: !model,
      skipPrecedingSeparator: true,
      // url: '/go-somewhere-or-execute-onClick',
      onClick: () => {
        console.log('Go action!');
      },
    },
  ];

  return <Breadcrumbs items={items} />;
}
