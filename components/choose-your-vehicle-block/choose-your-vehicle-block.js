'use client';

import { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useVehicleContext } from '@contexts/vehicle';
import constants from '@lib/constants';
import { trimSlash } from '@lib/trim-slash';
import { useVehicleSelection } from '@lib/use-vehicle-select';
import { getValueOrSlug } from '@lib/helpers';
import Container from '@components/container/container';
import Select from '@components/form/select';
import Button from '@components/button/button';
import styles from '../builder/ute-choose-your-vehicle.module.scss';

export default function ChooseYourVehicleBlock({
  makes: makersAndModels,
  variants,
  style,
  params,
}) {
  const variantsNormalized = variants?.map(variant => {
    return {
      label: variant.variantName,
      value: variant.variantSlug,
    };
  });
  const { maker, model, variant, setVariant, handleSave, setVehicleSelection } =
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
    [variantSlug],
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
          {variants?.length > 0 && (
            <Select
              size="large"
              placeholder={constants.SELECT_LABELS.VARIANT}
              options={variantsNormalized}
              value={getValueOrSlug(variant) || null}
              disabled={!variants.length}
              onChange={handleVariantChange}
              dropdownInDocumentFlow
              className={styles.select}
            />
          )}
          <Button
            rightIcon="arrow-forward"
            className={styles.button}
            onClick={() => handleSave(params, reload)}
            disabled={!model}
          >
            See details
          </Button>
        </div>
      </div>
    </Container>
  );
}
