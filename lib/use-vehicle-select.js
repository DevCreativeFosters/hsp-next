import { useCallback, useEffect, useMemo } from 'react';

import { useVehicleContext } from '@contexts/vehicle';

import { getValueOrSlug } from '@lib/helpers';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';

export const useVehicleSelection = (
  makersAndModels,
  setVehicleSelection,
  maker,
  factoryOptions,
) => {
  const {
    selectedFactoryOptions,
    setMaker,
    setModel,
    setSelectedFactoryOptions,
    setVariant,
  } = useVehicleContext();

  const findMakerBySlug = useCallback(
    slug => makersAndModels.find(({ slug: makerSlug }) => makerSlug === slug),
    [makersAndModels],
  );

  const findModelBySlug = useCallback(
    (makerSlug, modelSlug) => {
      return findMakerBySlug(makerSlug)?.models?.find(
        ({ slug }) => slug === modelSlug,
      );
    },
    [findMakerBySlug],
  );

  const makerSelectOptions = useMemo(
    () =>
      makersAndModels.map(({ name, slug }) => ({ label: name, value: slug })),
    [makersAndModels],
  );

  const factorySelectOptions = useMemo(
    () =>
      factoryOptions &&
      factoryOptions.map(({ slug, value }) => ({ label: value, value: slug })),
    [factoryOptions],
  );

  const modelSelectOptions = useMemo(() => {
    return maker
      ? makersAndModels
          .find(({ slug }) => slug === getValueOrSlug(maker))
          ?.models.map(({ name, slug }) => ({ label: name, value: slug })) || []
      : [];
  }, [maker, makersAndModels]);

  const handleMakerChange = useCallback(
    (value, label) => {
      setMaker({
        name: label,
        slug: value,
      });
      setModel(null);
    },
    [setMaker, setModel],
  );

  const handleModelChange = useCallback(
    (value, label) => {
      setModel({
        name: label,
        slug: value,
      });
    },
    [setModel],
  );

  const handleVariantChange = useCallback(
    (value, label) => {
      setVariant({
        name: label,
        slug: value,
      });
    },
    [setVariant],
  );

  const handleFactoryOptionsChange = useCallback(
    (value, label) => {
      let newFactoryOptions = selectedFactoryOptions
        ? [...selectedFactoryOptions]
        : [];
      const optionIndex = newFactoryOptions.findIndex(
        option => option.slug === value,
      );

      if (optionIndex !== -1) {
        newFactoryOptions.splice(optionIndex, 1);
      } else {
        newFactoryOptions.push({ slug: value, value: label });
      }

      setSelectedFactoryOptions(newFactoryOptions);
    },
    [selectedFactoryOptions, setSelectedFactoryOptions],
  );

  useEffect(() => {
    const savedSelection = localStorage.getItem(LOCAL_STORAGE_VEHICLE);
    if (savedSelection) {
      const savedVehicle = JSON.parse(savedSelection);
      const selectedFactoryOptions = savedVehicle?.selectedFactoryOptions;
      const makerFound = findMakerBySlug(getValueOrSlug(savedVehicle?.maker));
      const modelFound = findModelBySlug(
        getValueOrSlug(savedVehicle?.maker),
        getValueOrSlug(savedVehicle?.model),
      );

      if (makerFound) {
        setMaker(makerFound);
      }

      if (modelFound) {
        setModel(modelFound);
      }

      if (selectedFactoryOptions) {
        setSelectedFactoryOptions(selectedFactoryOptions);
      }

      if (makerFound || modelFound || selectedFactoryOptions) {
        setVehicleSelection({
          makerName: makerFound?.name || makerFound?.label,
          modelName: modelFound?.name || modelFound?.label,
          selectedFactoryOptions: selectedFactoryOptions || [],
        });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    factorySelectOptions,
    handleFactoryOptionsChange,
    handleMakerChange,
    handleModelChange,
    handleVariantChange,
    makerSelectOptions,
    modelSelectOptions,
  };
};
