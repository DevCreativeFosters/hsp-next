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
  const { setFactoryOption, setMaker, setModel, setVariant } =
    useVehicleContext();

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
      setFactoryOption({
        name: label,
        slug: value,
      });
    },
    [setFactoryOption],
  );

  useEffect(() => {
    const savedSelection = localStorage.getItem(LOCAL_STORAGE_VEHICLE);
    if (savedSelection) {
      const savedVehicle = JSON.parse(savedSelection);
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
      if (makerFound || modelFound) {
        setVehicleSelection({
          makerName: makerFound?.name || makerFound?.label,
          modelName: modelFound?.name || modelFound?.label,
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
