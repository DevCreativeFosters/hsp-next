'use client';

import { useContext, useEffect, useState } from 'react';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import AnimateHeight from 'react-animate-height';

import StoreLocatorContext from '@contexts/store-locator';
import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import constants from '@lib/constants';
import routes from '@lib/routes';
import { useVehicleSelection } from '@lib/use-vehicle-select';

import ActionModal from '@components/builder/action-modal';
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
  const router = useRouter();

  const {
    dropdownOpened,
    finalSelection,
    handleSave,
    handleVehicleReset,
    headerWidgetLoading,
    maker,
    model,
    selectedProducts,
    setCheckingProductCompatibility,
    setCovers,
    setDropdownOpened,
    setHeaderWidgetLoading,
    setIsProductCompatible,
    setSelectedCover,
    setSelectedProducts,
    setStepNumber,
    setVehicleSelection,
    stepNumber,
  } = useVehicleContext();

  const {
    setLocation,
    setLocationInput,
    setProductsSectionOpen,
    setSearchGeolocation,
    setSelectedStore,
    setShowLocationError,
  } = useContext(StoreLocatorContext);

  const {
    handleMakerChange,
    handleModelChange,
    localMaker,
    localModel,
    makerSelectOptions,
    modelSelectOptions,
    setLocalMaker,
    setLocalModel,
  } = useVehicleSelection(makersAndModels, setVehicleSelection, maker);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const isMobile = useIsMobile(1280);
  const nonEmptySelection = maker && model && finalSelection;

  const internalMaker = localMaker || maker;
  const internalModel = localModel || model;

  const Icon = dropdownOpened ? (
    <CloseIcon />
  ) : nonEmptySelection ? (
    <EditIcon />
  ) : (
    <ExpandMoreNeutralIcon />
  );

  useEffect(() => {
    if (maker && localMaker && maker?.slug === localMaker?.slug) {
      handleSave();
      setLocalMaker(null);
      setLocalModel(null);
      setStepNumber(0);
      setShowUpdateModal(false);
      setDropdownOpened(false);
      setCheckingProductCompatibility(false);
    }
  }, [
    handleSave,
    localMaker,
    maker,
    setCheckingProductCompatibility,
    setDropdownOpened,
    setIsProductCompatible,
    setLocalMaker,
    setLocalModel,
    setStepNumber,
  ]);

  const handleInternalSave = () => {
    handleMakerChange(internalMaker?.slug, internalMaker?.name);
    handleModelChange(internalModel?.slug, internalModel?.name);
    setSelectedCover(null);
    setCovers([]);
  };

  const handleOnResetAccept = () => {
    handleVehicleReset();
    setSelectedProducts([]);
    setSelectedCover(null);
    setCovers([]);
    setShowResetModal(false);
  };

  const handleOnResetClose = () => {
    setShowResetModal(false);
  };

  const handleOnUpdateAccept = () => {
    handleInternalSave();
  };

  const handleOnUpdateClose = () => {
    setShowUpdateModal(false);
  };

  return (
    <>
      {headerWidgetLoading ? (
        <>
          <Loading color="white" />
        </>
      ) : (
        <>
          {showResetModal && (
            <ActionModal
              onAccept={handleOnResetAccept}
              onClose={handleOnResetClose}
            />
          )}
          {showUpdateModal && (
            <ActionModal
              actionText={'update'}
              onAccept={handleOnUpdateAccept}
              onClose={handleOnUpdateClose}
            />
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
                      setShowResetModal(true);
                      setHeaderWidgetLoading(false);
                    } else {
                      handleVehicleReset();
                      if (setProductsSectionOpen) setProductsSectionOpen(true);
                      if (setShowLocationError) setShowLocationError(false);
                      if (setSearchGeolocation) setSearchGeolocation(null);
                      if (setSelectedStore) setSelectedStore(null);
                      if (setLocation) setLocation(undefined);
                      if (setLocationInput) setLocationInput('');
                    }
                  }}
                >
                  <CancelIcon />
                </button>
              </div>
            </div>

            <AnimateHeight
              aria-hidden="false"
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
                    onChange={(value, label) => {
                      if (pathname === routes.uteBuilder) {
                        setLocalMaker({
                          name: label,
                          slug: value,
                        });
                      } else {
                        handleMakerChange(value, label);
                      }
                    }}
                    options={makerSelectOptions}
                    placeholder={constants.SELECT_LABELS.MAKER}
                    size="large"
                    value={internalMaker?.slug || null}
                  />
                  <Select
                    disabled={!modelSelectOptions.length}
                    dropdownInDocumentFlow
                    onChange={(value, label) => {
                      if (pathname === routes.uteBuilder) {
                        setLocalModel({
                          name: label,
                          slug: value,
                        });
                      } else {
                        handleModelChange(value, label);
                      }
                    }}
                    options={modelSelectOptions}
                    placeholder={constants.SELECT_LABELS.MODEL}
                    size="large"
                    value={internalModel?.slug || null}
                  />
                  <Button
                    className={styles.save}
                    disabled={!internalModel}
                    onClick={() => {
                      if (pathname === routes.uteBuilder) {
                        if (
                          finalSelection &&
                          finalSelection?.makerName !== internalMaker?.name &&
                          finalSelection?.modelName !== internalModel?.name &&
                          stepNumber > 0 &&
                          selectedProducts.length > 0
                        ) {
                          setShowUpdateModal(true);
                        } else {
                          handleInternalSave();
                        }
                      } else {
                        handleSave({
                          mainCategorySlug: pathname.split('/')[1],
                          makeSlug: internalMaker?.slug,
                          modelSlug: internalModel?.slug,
                        });
                      }
                      router.push(`/collections/${internalModel?.slug}`);
                    }}
                    rightIcon="arrow-forward"
                    size="large"
                    variant="primary"
                  >
                    View Products
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
