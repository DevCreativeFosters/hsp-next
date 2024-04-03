'use client';

import { useVehicleContext } from '@contexts/vehicle';

import constants from '@lib/constants';
import { getValueOrSlug } from '@lib/helpers';
import { useVehicleSelection } from '@lib/use-vehicle-select';

import Alert from '@components/alert/alert';
import Button from '@components/button/button';
import Container from '@components/container/container';
import Select from '@components/form/select';

import styles from './ute-choose-your-vehicle.module.scss';

export default function UTEChooseYourVehicle({
  makes: makersAndModels,
  factoryOptions,
}) {
  const { maker, model, handleSave, setVehicleSelection } = useVehicleContext();
  const {
    handleMakerChange,
    handleModelChange,
    makerSelectOptions,
    modelSelectOptions,
  } = useVehicleSelection(makersAndModels, setVehicleSelection, maker);

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
            size="large"
            placeholder={constants.SELECT_LABELS.MAKER}
            options={makerSelectOptions}
            value={getValueOrSlug(maker) || null}
            dropdownInDocumentFlow
            onChange={handleMakerChange}
            className={styles.select}
          />
          <Select
            size="large"
            placeholder={constants.SELECT_LABELS.MODEL}
            options={modelSelectOptions}
            value={getValueOrSlug(model) || null}
            disabled={!modelSelectOptions.length}
            dropdownInDocumentFlow
            onChange={handleModelChange}
            className={styles.select}
          />
          {factoryOptions?.length > 0 && (
            <Select
              size="large"
              placeholder={constants.SELECT_LABELS.FACTORY_OPTIONS}
              options={factoryOptions}
              value={getValueOrSlug(model) || null}
              dropdownInDocumentFlow
              className={styles.select}
            />
          )}
          <Button
            rightIcon="arrow-forward"
            className={styles.button}
            onClick={handleSave}
            disabled={!model}
          >
            Start building
          </Button>
        </div>
      </div>
    </Container>
  );
}
