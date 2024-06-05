import { useCallback, useEffect, useMemo, useState } from 'react';

import { useVehicleContext } from '@contexts/vehicle';

import { getValueOrSlug } from '@lib/helpers';
import { LOCAL_STORAGE_VEHICLE } from '@lib/local-storage';

export const useVehicleSelection = (
  makersAndModels,
  setVehicleSelection,
  maker,
) => {
  const {
    setCompatibleFactoryOptions,
    setMaker,
    setModel,
    setSelectedFactoryOption,
    setVariant,
  } = useVehicleContext();

  const [localMaker, setLocalMaker] = useState(null);
  const [localModel, setLocalModel] = useState(null);

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
    const _maker = localMaker || maker;

    return _maker
      ? makersAndModels
          .find(({ slug }) => slug === getValueOrSlug(_maker))
          ?.models.map(({ name, slug }) => ({ label: name, value: slug })) || []
      : [];
  }, [localMaker, maker, makersAndModels]);

  const handleMakerChange = useCallback(
    (value, label) => {
      setMaker({
        name: label,
        slug: value,
      });
      setModel(null);
      setCompatibleFactoryOptions([]);
      setSelectedFactoryOption(null);
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
    (slug, compatibleFactoryOptions) => {
      const selectedFactoryOption =
        compatibleFactoryOptions?.find(option => {
          if (option.slug === slug) {
            return option;
          }
        }) || null;

      setSelectedFactoryOption(selectedFactoryOption);
    },
    [setSelectedFactoryOption],
  );

  useEffect(() => {
    const savedSelection = localStorage.getItem(LOCAL_STORAGE_VEHICLE);
    if (savedSelection) {
      const savedVehicle = JSON.parse(savedSelection);
      const selectedFactoryOption = savedVehicle?.selectedFactoryOption;
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

      if (selectedFactoryOption) {
        setSelectedFactoryOption(selectedFactoryOption);
      }

      if (makerFound || modelFound || selectedFactoryOption) {
        setVehicleSelection({
          makerName: makerFound?.name || makerFound?.label,
          modelName: modelFound?.name || modelFound?.label,
          selectedFactoryOption: selectedFactoryOption || [],
        });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    handleFactoryOptionsChange,
    handleMakerChange,
    handleModelChange,
    handleVariantChange,
    localMaker,
    localModel,
    makerSelectOptions,
    modelSelectOptions,
    setLocalMaker,
    setLocalModel,
  };
};
