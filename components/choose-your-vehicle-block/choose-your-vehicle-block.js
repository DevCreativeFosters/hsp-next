'use client';

import { useEffect, useMemo } from 'react';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import { useVehicleContext } from '@contexts/vehicle';

import constants from '@lib/constants';
import { getValueOrSlug } from '@lib/helpers';
import { trimSlash } from '@lib/trim-slash';
import { useVehicleSelection } from '@lib/use-vehicle-select';

import Button from '@components/button/button';
import Container from '@components/container/container';
import Select from '@components/form/select';

import styles from '../builder/ute-choose-your-vehicle.module.scss';

export default function ChooseYourVehicleBlock({
  makes: makersAndModels,
  params,
  style,
  variants,
}) {
  const variantsNormalized = variants?.map(variant => {
    return {
      label: variant.variantName,
      value: variant.variantSlug,
    };
  });
  const { handleSave, maker, model, setVariant, setVehicleSelection, variant } =
    useVehicleContext();
  const {
    handleMakerChange,
    handleModelChange,
    handleVariantChange,
    makerSelectOptions,
    modelSelectOptions,
  } = useVehicleSelection(makersAndModels, setVehicleSelection, maker);

  const path = usePathname();

  const variantSlug = useMemo(() => {
    return path.split('/').pop();
  }, [path]);

  const reload = !getValueOrSlug(variant);

  useEffect(
    function setGlobalVariantStateBySlug() {
      variantsNormalized?.forEach(variant => {
        if (trimSlash(variant.value) === variantSlug) {
          setVariant(variant);
        }
      });
    },
    [setVariant, variantSlug, variantsNormalized],
  );

  return (
    <Container
      className={clsx(styles.container, {
        [styles.flexibleBlockContainer]: style === 'flexible',
      })}
    >
      <div
        className={clsx(styles.chooseVehicleContainer, {
          [styles.flexibleChooseYourVehicleContainer]: style === 'flexible',
        })}
      >
        <p className={styles.chooseVehiclePill}>
          {constants.SELECT_LABELS.GENERIC_FULL}
        </p>
        <div className={styles.vehicleSelector}>
          <Select
            className={styles.select}
            dropdownInDocumentFlow
            onChange={handleMakerChange}
            options={makerSelectOptions}
            placeholder={constants.SELECT_LABELS.MAKER}
            size="large"
            value={getValueOrSlug(maker) || null}
          />
          <Select
            className={styles.select}
            disabled={!modelSelectOptions.length}
            dropdownInDocumentFlow
            onChange={handleModelChange}
            options={modelSelectOptions}
            placeholder={constants.SELECT_LABELS.MODEL}
            size="large"
            value={getValueOrSlug(model) || null}
          />
          {variants?.length > 0 && (
            <Select
              className={styles.select}
              disabled={!variants.length}
              dropdownInDocumentFlow
              onChange={handleVariantChange}
              options={variantsNormalized}
              placeholder={constants.SELECT_LABELS.VARIANT}
              size="large"
              value={getValueOrSlug(variant) || null}
            />
          )}
          <Button
            className={styles.button}
            disabled={!model}
            onClick={() => handleSave(params, reload)}
            rightIcon="arrow-forward"
          >
            See details
          </Button>
        </div>
      </div>
    </Container>
  );
}
