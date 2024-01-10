import { useCallback, useEffect, useMemo } from 'react';
import { useVehicleContext } from '@contexts/vehicle';
import { getValueOrSlug } from '@lib/helpers';
import constants from './constants';

export const useVehicleSelection = (
  makersAndModels,
  setVehicleSelection,
  maker,
) => {
  const { setMaker, setModel } = useVehicleContext();

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

  const modelSelectOptions = useMemo(() => {
    return maker
      ? makersAndModels
          .find(({ slug }) => slug === getValueOrSlug(maker))
          ?.models.map(({ name, slug }) => ({ label: name, value: slug })) || []
      : [];
  }, [makersAndModels, maker]);

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

  useEffect(() => {
    const savedSelection = localStorage.getItem(
      constants.LOCAL_STORAGE_VEHICLE,
    );
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
  }, []);

  return {
    handleMakerChange,
    handleModelChange,
    makerSelectOptions,
    modelSelectOptions,
  };
};
