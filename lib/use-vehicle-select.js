import { useCallback, useEffect, useMemo } from 'react';
import { useVehicleContext } from '@contexts/vehicle';
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
          .find(({ slug }) => slug === maker.slug)
          ?.models.map(({ name, slug }) => ({ label: name, value: slug })) || []
      : [];
  }, [makersAndModels, maker]);

  const handleMakerChange = useCallback((value, label) => {
    setMaker({
      name: label,
      slug: value,
    });
    setModel(null);
  }, []);

  const handleModelChange = useCallback((value, label) => {
    setModel({
      name: label,
      slug: value,
    });
  }, []);

  useEffect(() => {
    const savedSelection = localStorage.getItem(
      constants.LOCAL_STORAGE_VEHICLE,
    );
    if (savedSelection) {
      const savedVehicle = JSON.parse(savedSelection);
      const makerFound = findMakerBySlug(savedVehicle?.maker?.slug);
      const modelFound = findModelBySlug(
        savedVehicle?.maker?.slug,
        savedVehicle?.model?.slug,
      );

      if (makerFound) {
        setMaker(makerFound);
      }
      if (modelFound) {
        setModel(modelFound);
      }
      if (makerFound || modelFound) {
        setVehicleSelection({
          makerName: makerFound?.name,
          modelName: modelFound?.name,
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
