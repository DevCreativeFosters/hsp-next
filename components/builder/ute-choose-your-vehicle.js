'use client';

import { useEffect, useState } from 'react';

import { useVehicleContext } from '@contexts/vehicle';

import constants from '@lib/constants';
import { getValueOrSlug } from '@lib/helpers';
import { useVehicleSelection } from '@lib/use-vehicle-select';

import Alert from '@components/alert/alert';
import Button from '@components/button/button';
import Container from '@components/container/container';
import Select from '@components/form/select';

import styles from './ute-choose-your-vehicle.module.scss';

export default function UTEChooseYourVehicle({ makes }) {
  const {
    handleSave,
    maker,
    model,
    selectedFactoryOption,
    setVehicleSelection,
  } = useVehicleContext();
  const {
    handleFactoryOptionsChange,
    handleMakerChange,
    handleModelChange,
    makerSelectOptions,
    modelSelectOptions,
  } = useVehicleSelection(makes, setVehicleSelection, maker);

  const [compatibleFactoryOptions, setCompatibleFactoryOptions] = useState([]);

  useEffect(
    function getCompatibleFactoryOptions() {
      if (!maker || !model) {
        return;
      }

      const compatibleFactoryOptions = makes
        .find(make => make.name === maker.name)
        ?.models.find(m => m.name === model.name).compatibleFactoryOptions;

      setCompatibleFactoryOptions(compatibleFactoryOptions);
    },
    [maker, model, setCompatibleFactoryOptions],
  );

  return (
    <Container className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to the HSP UTE Builder</h1>
        <Alert
          content="To get started, please select your vehicle make and model below."
          icon="info"
        />
      </div>
      <div className={styles.chooseVehicleContainer}>
        <h2 className={styles.chooseVehicleTitle}>Choose your vehicle</h2>
        <div className={styles.vehicleSelector}>
          <Select
            className={styles.select}
            dropdownInDocumentFlow
            name="maker"
            onChange={(slug, name) => {
              handleMakerChange(slug, name);
            }}
            options={makerSelectOptions}
            placeholder={constants.SELECT_LABELS.MAKER}
            size="large"
            value={getValueOrSlug(maker) || null}
          />
          <Select
            className={styles.select}
            disabled={!modelSelectOptions.length}
            dropdownInDocumentFlow
            name="model"
            onChange={(slug, name) => {
              handleModelChange(slug, name);
            }}
            options={modelSelectOptions}
            placeholder={constants.SELECT_LABELS.MODEL}
            size="large"
            value={getValueOrSlug(model) || null}
          />
          {compatibleFactoryOptions?.length > 0 && (
            <Select
              className={styles.select}
              dropdownInDocumentFlow
              name="factoryOptions"
              onChange={(value, label) => {
                handleFactoryOptionsChange(value, label);
              }}
              options={compatibleFactoryOptions}
              placeholder={constants.SELECT_LABELS.FACTORY_OPTIONS}
              size="large"
              value={getValueOrSlug(selectedFactoryOption) || null}
            />
          )}
          <Button
            className={styles.button}
            disabled={!model}
            onClick={handleSave}
            rightIcon="arrow-forward"
          >
            Start building
          </Button>
        </div>
      </div>
    </Container>
  );
}
