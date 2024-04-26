'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import AnimateHeight from 'react-animate-height';

import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import constants from '@lib/constants';
import { getValueOrSlug } from '@lib/helpers';
import routes from '@lib/routes';
import { useVehicleSelection } from '@lib/use-vehicle-select';

import ResetModal from '@components/builder/reset-modal';
import Button from '@components/button/button';
import Select from '@components/form/select';
import Loading from '@components/loading/loading';

import CancelIcon from '@assets/icons/cancel.svg';
import CloseIcon from '@assets/icons/close.svg';
import EditIcon from '@assets/icons/edit.svg';
import ExpandMoreNeutralIcon from '@assets/icons/expand-more-neutral.svg';

import styles from './choose-your-vehicle.module.scss';

export default function ChooseYourVehicle({ makes: makersAndModels }) {
  const pathname = usePathname();

  const {
    dropdownOpened,
    finalSelection,
    handleSave,
    handleVehicleReset,
    maker,
    model,
    selectedProducts,
    setDropdownOpened,
    setSelectedProducts,
    setVehicleSelection,
  } = useVehicleContext();

  const {
    handleMakerChange,
    handleModelChange,
    makerSelectOptions,
    modelSelectOptions,
  } = useVehicleSelection(makersAndModels, setVehicleSelection, maker);

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isMobile = useIsMobile(1280);
  const nonEmptySelection = maker && model && finalSelection;

  const Icon = dropdownOpened ? (
    <CloseIcon />
  ) : nonEmptySelection ? (
    <EditIcon />
  ) : (
    <ExpandMoreNeutralIcon />
  );

  console.log(maker, model);

  useEffect(() => {
    if (!maker && !model) {
      setIsLoading(false);
    }
  }, [maker, model]);

  const handleOnAccept = () => {
    handleVehicleReset();
    setSelectedProducts([]);
    setShowModal(false);
  };

  const handleOnClose = () => {
    setShowModal(false);
  };

  return (
    <>
      {isLoading ? (
        <>
          <Loading color="white" />
        </>
      ) : (
        <>
          {showModal && (
            <ResetModal onAccept={handleOnAccept} onClose={handleOnClose} />
          )}
          <span className={styles.vehicleText}>My vehicle:</span>
          <div className={styles.container}>
            <div className={styles.containerTrigger}>
              <Button
                className={clsx(styles.chooseButton, {
                  [styles.opened]: dropdownOpened,
                  [styles.nonEmpty]: finalSelection,
                })}
                onClick={() => setDropdownOpened(!dropdownOpened)}
                variant="primary"
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
                <button
                  className={styles.resetButton}
                  onClick={() => {
                    if (
                      selectedProducts.length &&
                      pathname === routes.uteBuilder
                    ) {
                      setShowModal(true);
                      setIsLoading(false);
                    } else {
                      handleVehicleReset();
                      setIsLoading(true);
                    }
                  }}
                >
                  <CancelIcon />
                </button>
              </div>
            </div>

            <AnimateHeight
              className={styles.containerAnimateHeight}
              contentClassName={clsx(styles.containerInner, {
                [styles.opened]: dropdownOpened,
              })}
              duration={300}
              height={dropdownOpened ? 'auto' : 0}
            >
              <div className={styles.dropdownOuter}>
                <div className={styles.dropdownInner}>
                  <Select
                    dropdownInDocumentFlow
                    onChange={handleMakerChange}
                    options={makerSelectOptions}
                    placeholder={constants.SELECT_LABELS.MAKER}
                    size="large"
                    value={getValueOrSlug(maker) || null}
                  />
                  <Select
                    disabled={!modelSelectOptions.length}
                    dropdownInDocumentFlow
                    onChange={handleModelChange}
                    options={modelSelectOptions}
                    placeholder={constants.SELECT_LABELS.MODEL}
                    size="large"
                    value={getValueOrSlug(model) || null}
                  />
                  <Button
                    className={styles.save}
                    disabled={!maker && !model}
                    onClick={handleSave}
                    rightIcon="save"
                    variant="primary"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </AnimateHeight>
          </div>
        </>
      )}
    </>
  );
}
