'use client';

import clsx from 'clsx';
import { useCallback, useState, useEffect } from 'react';
import { useIsMobile } from '@hooks/useIsMobile';
import { setCookie, deleteCookie } from '@lib/cookies';
import Button from '@components/button/button';
import ArrowDown from '@assets/icons/expand-more-primary.svg';
import styles from './choose-your-vehicle.module.scss';
import slugify from '@lib/slugify';

const LOCAL_STORAGE_VEHICLE = 'hsp-my-vehicle';

const SELECT_LABELS = {
  GENERIC: 'Choose',
  VEHICLE: 'Choose your vehicle',
  MAKER: 'Choose make',
  MODEL: 'Choose model',
};

export default function ChooseYourVehicle({ makes }) {
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [displayMakes, setDisplayMakes] = useState(false);
  const [displayModels, setDisplayModels] = useState(false);
  const [makeSelected, setMakeSelected] = useState(null);
  const [modelSelected, setModelSelected] = useState(null);
  const [finalSelection, setFinalSelection] = useState(null);

  const isMobile = useIsMobile(1280);
  const nonEmptySelection = makeSelected && modelSelected && finalSelection;

  const makeAndModels = makes.map(make => {
    return {
      name: make.name,
      models: make.children.nodes.map(({ name }) => {
        return {
          name: name,
        };
      }),
    };
  });

  const handleCancel = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_VEHICLE);
    deleteCookie(LOCAL_STORAGE_VEHICLE);
    setMakeSelected(null);
    setModelSelected(null);
    setFinalSelection(null);
  }, []);

  const handleSave = useCallback(() => {
    const savedVehicle = JSON.stringify({
      maker: makeSelected,
      model: modelSelected,
    });
    localStorage.setItem(LOCAL_STORAGE_VEHICLE, savedVehicle);

    setCookie(LOCAL_STORAGE_VEHICLE, savedVehicle, 7);

    setFinalSelection({
      maker: makeSelected,
      model: modelSelected,
    });
    setDropdownOpened(false);
  }, [makeSelected, modelSelected]);

  const handleSelectedMake = useCallback(make => {
    setMakeSelected({
      label: make,
      value: slugify(make),
    });
    setModelSelected(null);
    setDisplayMakes(false);
  }, []);

  const handleSelectedModel = useCallback(model => {
    setModelSelected({
      label: model,
      value: slugify(model),
    });
    setDisplayModels(false);
  }, []);

  useEffect(function loadSavedVehicle() {
    const savedSelection = localStorage.getItem(LOCAL_STORAGE_VEHICLE);
    if (savedSelection) {
      const savedVehicle = JSON.parse(savedSelection);
      setMakeSelected(savedVehicle.maker);
      setModelSelected(savedVehicle.model);
      setFinalSelection({
        maker: savedVehicle.maker,
        model: savedVehicle.model,
      });
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <Button
          variant="primary"
          rightIcon={
            dropdownOpened
              ? 'close'
              : nonEmptySelection
              ? 'edit'
              : 'expand-more-primary'
          }
          onClick={() => setDropdownOpened(!dropdownOpened)}
          className={clsx(styles.chooseButton, {
            [styles.closed]: !dropdownOpened && nonEmptySelection,
            [styles.opened]: dropdownOpened,
            [styles.selected]: nonEmptySelection,
          })}
        >
          {!finalSelection ? (
            isMobile ? (
              SELECT_LABELS.VEHICLE
            ) : (
              SELECT_LABELS.GENERIC
            )
          ) : (
            <>
              {finalSelection.maker?.label}{' '}
              <span className={styles.modelAndVariantText}>
                {finalSelection.model?.label}
              </span>
            </>
          )}
        </Button>
        {nonEmptySelection && !dropdownOpened && !isMobile && (
          <Button
            className={styles.cancelButton}
            variant="primary"
            rightIcon={'cancel'}
            onClick={handleCancel}
          />
        )}
      </div>
      {dropdownOpened && (
        <div className={styles.dropdownMenu}>
          <div className={styles.menuContainer}>
            <button
              className={styles.select}
              onClick={() => setDisplayMakes(!displayMakes)}
            >
              {makeSelected?.label || SELECT_LABELS.MAKER} <ArrowDown />
            </button>
            {displayMakes && (
              <div>
                {makeAndModels.map(make => (
                  <button
                    className={styles.option}
                    key={make.name}
                    value={make.name}
                    onClick={() => handleSelectedMake(make.name)}
                  >
                    {make.name}
                  </button>
                ))}
              </div>
            )}
            <div
              className={clsx(styles.select, {
                [styles.disabled]: !makeSelected,
              })}
              onClick={() => {
                if (makeSelected) {
                  setDisplayModels(!displayModels);
                }
              }}
            >
              {modelSelected?.label || SELECT_LABELS.MODEL} <ArrowDown />
            </div>
            {displayModels && (
              <div>
                {makeAndModels.map(({ name, models }) => {
                  if (name === makeSelected.label) {
                    return models.map(model => (
                      <button
                        className={styles.option}
                        key={model.name}
                        value={model.name}
                        onClick={() => handleSelectedModel(model.name)}
                      >
                        {model.name}
                      </button>
                    ));
                  }
                })}
              </div>
            )}
            <Button
              variant="primary"
              rightIcon="save"
              onClick={handleSave}
              disabled={!makeSelected || !modelSelected}
              className={styles.save}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
