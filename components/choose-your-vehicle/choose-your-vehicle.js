'use client';

import clsx from 'clsx';
import AnimateHeight from 'react-animate-height';

import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import constants from '@lib/constants';
import { getValueOrSlug } from '@lib/helpers';
import { useVehicleSelection } from '@lib/use-vehicle-select';

import Button from '@components/button/button';
import Select from '@components/form/select';

import CancelIcon from '@assets/icons/cancel.svg';
import CloseIcon from '@assets/icons/close.svg';
import EditIcon from '@assets/icons/edit.svg';
import ExpandMoreNeutralIcon from '@assets/icons/expand-more-neutral.svg';

import styles from './choose-your-vehicle.module.scss';

export default function ChooseYourVehicle({ makes: makersAndModels }) {
  const {
    maker,
    model,
    handleSave,
    handleVehicleReset,
    finalSelection,
    setVehicleSelection,
    dropdownOpened,
    setDropdownOpened,
  } = useVehicleContext();

  const {
    handleMakerChange,
    handleModelChange,
    makerSelectOptions,
    modelSelectOptions,
  } = useVehicleSelection(makersAndModels, setVehicleSelection, maker);

  const isMobile = useIsMobile(1280);
  const nonEmptySelection = maker && model && finalSelection;

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
              {constants.SELECT_LABELS.GENERIC_FULL}
            </span>
          ) : (
            constants.SELECT_LABELS.GENERIC_SHORT
          )}
          <div className={styles.iconWrapper}>{Icon}</div>
        </Button>

        <div className={styles.resetButtonContainer}>
          <button className={styles.resetButton} onClick={handleVehicleReset}>
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
              placeholder={constants.SELECT_LABELS.MAKER}
              options={makerSelectOptions}
              value={getValueOrSlug(maker) || null}
              dropdownInDocumentFlow
              onChange={handleMakerChange}
            />
            <Select
              size="large"
              placeholder={constants.SELECT_LABELS.MODEL}
              options={modelSelectOptions}
              value={getValueOrSlug(model) || null}
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
