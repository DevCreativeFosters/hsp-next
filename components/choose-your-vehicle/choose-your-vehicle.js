'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import AnimateHeight from 'react-animate-height';
import clsx from 'clsx';
import { useVehicleContext } from '@contexts/vehicle';
import { setCookie, deleteCookie } from '@lib/cookies';
import { useIsMobile } from '@hooks/useIsMobile';
import Select from '@components/form/select';
import Button from '@components/button/button';
import EditIcon from '@assets/icons/edit.svg';
import CloseIcon from '@assets/icons/close.svg';
import CancelIcon from '@assets/icons/cancel.svg';
import ExpandMoreNeutralIcon from '@assets/icons/expand-more-neutral.svg';
import styles from './choose-your-vehicle.module.scss';

const LOCAL_STORAGE_VEHICLE = 'hsp-my-vehicle';

const SELECT_LABELS = {
  GENERIC_SHORT: 'Choose',
  GENERIC_FULL: 'Choose your vehicle',
  MAKER: 'Choose make',
  MODEL: 'Choose model',
};

export default function ChooseYourVehicle({ makes: makersAndModels }) {
  const {
    setSavedVehicleGlobal,
    savedVehicleGlobal,
    finalSelection,
    setVehicleSelection,
  } = useVehicleContext();

  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [maker, setMaker] = useState(null);
  const [model, setModel] = useState(null);

  const isMobile = useIsMobile(1280);
  const nonEmptySelection = maker && model && finalSelection;

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
      makersAndModels.map(({ name, slug }) => ({
        label: name,
        value: slug,
      })),
    [makersAndModels],
  );

  const modelSelectOptions = useMemo(() => {
    return (
      makersAndModels
        .find(({ slug }) => slug === maker?.slug)
        ?.models.map(({ name, slug }) => ({
          value: slug,
          label: name,
        })) || []
    );
  }, [makersAndModels, maker]);

  const handleVehicleReset = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_VEHICLE);
    deleteCookie(LOCAL_STORAGE_VEHICLE);
    setMaker(null);
    setModel(null);
    setVehicleSelection(null);
    setSavedVehicleGlobal(null);
  }, [setVehicleSelection, setSavedVehicleGlobal]);

  const handleSave = useCallback(() => {
    const vehicleString = JSON.stringify({
      maker,
      model,
    });

    localStorage.setItem(LOCAL_STORAGE_VEHICLE, vehicleString);
    setCookie(LOCAL_STORAGE_VEHICLE, vehicleString, 7);

    setSavedVehicleGlobal({
      maker,
      model,
    });

    setVehicleSelection({
      makerName: maker?.name || undefined,
      modelName: model?.name || undefined,
    });
    setDropdownOpened(false);
  }, [maker, model, setSavedVehicleGlobal, setVehicleSelection]);

  const handleMakerChange = useCallback((value, label) => {
    setMaker({
      name: label,
      slug: value,
      value, // @TODO: remove it after "value -> slug" rename
    });
    setModel(null);
  }, []);

  const handleModelChange = useCallback((value, label) => {
    setModel({
      name: label,
      slug: value,
      value, // @TODO: remove it after "value -> slug" rename
    });
  }, []);

  useEffect(
    function loadSavedVehicle() {
      const savedSelection = localStorage.getItem(LOCAL_STORAGE_VEHICLE);
      if (savedSelection) {
        const savedVehicle = JSON.parse(savedSelection);

        const makerFound = findMakerBySlug(savedVehicle?.maker?.value); // @TODO: remove it after "value -> slug" rename, use commented-out code above instead
        const modelFound = findModelBySlug(
          savedVehicle?.maker?.value,
          savedVehicle?.model?.value,
        ); // @TODO: remove it after "value -> slug" rename, use commented-out code above instead

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
    },
    [savedVehicleGlobal],
  );

  const Icon = dropdownOpened ? (
    <CloseIcon />
  ) : nonEmptySelection ? (
    <EditIcon />
  ) : (
    <ExpandMoreNeutralIcon />
  );

  return (
    <div className={styles.container}>
      <div className={styles.containerTrigger}>
        <Button
          variant="primary"
          onClick={() => setDropdownOpened(!dropdownOpened)}
          className={clsx(styles.chooseButton, {
            [styles.opened]: dropdownOpened,
            [styles.nonEmpty]: finalSelection,
          })}
        >
          {finalSelection ? (
            <span className={styles.fullName}>
              {finalSelection.makerName}{' '}
              <span className={styles.modelAndVariantText}>
                {finalSelection.modelName}
              </span>
            </span>
          ) : isMobile ? (
            <span className={styles.placeholder}>
              {SELECT_LABELS.GENERIC_FULL}
            </span>
          ) : (
            SELECT_LABELS.GENERIC_SHORT
          )}
          <div className={styles.iconWrapper}>{Icon}</div>
        </Button>

        <div className={styles.resetButtonContainer}>
          <button
            className={styles.resetButton}
            variant="primary"
            onClick={handleVehicleReset}
          >
            <CancelIcon />
          </button>
        </div>
      </div>

      <AnimateHeight
        className={styles.containerAnimateHeight}
        height={dropdownOpened ? 'auto' : 0}
        duration={300}
        contentClassName={clsx(styles.containerInner, {
          [styles.opened]: dropdownOpened,
        })}
      >
        <div className={styles.dropdownOuter}>
          <div className={styles.dropdownInner}>
            <Select
              size="large"
              placeholder={SELECT_LABELS.MAKER}
              options={makerSelectOptions}
              value={maker?.slug || null}
              dropdownInDocumentFlow
              onChange={handleMakerChange}
            />
            <Select
              size="large"
              placeholder={SELECT_LABELS.MODEL}
              options={modelSelectOptions}
              value={model?.slug || null}
              disabled={!modelSelectOptions.length}
              dropdownInDocumentFlow
              onChange={handleModelChange}
            />
            <Button
              className={styles.save}
              variant="primary"
              rightIcon="save"
              onClick={handleSave}
              disabled={!maker && !model}
            >
              Save
            </Button>
          </div>
        </div>
      </AnimateHeight>
    </div>
  );
}
