'use client';

import clsx from 'clsx';
import { useCallback, useState, useEffect } from 'react';
import { useIsMobile } from '@hooks/useIsMobile';
import Button from '@components/button/button';
import ArrowDown from '@assets/material-icons/expand-more-primary.svg';
import styles from './choose-your-vehicle.module.scss';

const LOCAL_STORAGE_VEHICLE = 'hsp-my-vehicle';

const SELECT_LABELS = {
  GENERIC: 'Choose',
  VEHICLE: 'Choose your vehicle',
  MAKE: 'Choose make',
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
    setMakeSelected(null);
    setModelSelected(null);
    setFinalSelection(null);
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem(
      LOCAL_STORAGE_VEHICLE,
      JSON.stringify({ make: makeSelected, model: modelSelected }),
    );

    setFinalSelection({
      make: makeSelected,
      model: modelSelected,
    });
    setDropdownOpened(false);
  }, [makeSelected, modelSelected]);

  const handleSelectedMake = useCallback(make => {
    setMakeSelected(make);
    setModelSelected(null);
    setDisplayMakes(false);
  }, []);

  const handleSelectedModel = useCallback(model => {
    setModelSelected(model);
    setDisplayModels(false);
  }, []);

  useEffect(function loadSavedVehicle() {
    const savedSelection = localStorage.getItem(LOCAL_STORAGE_VEHICLE);
    if (savedSelection) {
      const { make, model } = JSON.parse(savedSelection);
      setMakeSelected(make);
      setModelSelected(model);
      setFinalSelection({
        make: make,
        model: model,
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
              {finalSelection.make}{' '}
              <span className={styles.modelAndVariantText}>
                {finalSelection.model}
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
              {makeSelected || SELECT_LABELS.MAKE} <ArrowDown />
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
              {modelSelected || SELECT_LABELS.MODEL} <ArrowDown />
            </div>
            {displayModels && (
              <div>
                {makeAndModels.map(({ name, models }) => {
                  if (name === makeSelected) {
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
