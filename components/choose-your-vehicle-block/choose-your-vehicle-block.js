'use client';

import { useEffect, useMemo, useRef } from 'react';

import { usePathname } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import constants from '@lib/constants';
import { getValueOrSlug } from '@lib/helpers';
import { trimSlash } from '@lib/trim-slash';
import { useVehicleSelection } from '@lib/use-vehicle-select';

import Button from '@components/button/button';
import Container from '@components/container/container';
import Select from '@components/form/select';

import styles from './choose-your-vehicle-block.module.scss';

export default function ChooseYourVehicleBlock({
  makes: makersAndModels,
  variants,
  params,
}) {
  const wrapperRef = useRef();
  const stickerRef = useRef();
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

  const windowSize = useWindowSize();
  const isMobile = useIsMobile();

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

  useEffect(
    function attachIntersectionObserver() {
      const { width, height } = windowSize;
      const el = wrapperRef.current;
      const stickerEl = stickerRef.current;
      const stickerHeight = stickerEl.clientHeight;
      let io;
      if (width && height && el) {
        const headerHeight =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--header-height',
            ),
          ) || 0;
        const top = headerHeight + Math.floor(stickerHeight / 2);
        const bottom = height - top;
        const rootMargin = `-${top - 1}px 0px -${bottom}px 0px`;
        io = new IntersectionObserver(
          function (entries) {
            const entry = entries[0];
            const { isIntersecting } = entry;

            el.classList.toggle(styles.isCloseToHeader, isIntersecting);
          },
          {
            root: document.body,
            rootMargin,
            threshold: 0,
          },
        );
        io.observe(el);
      }

      return () => {
        if (io) {
          io.disconnect();
        }
      };
    },
    [windowSize.width, windowSize.height],
  );

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Container>
        <h3 className={styles.sticker} ref={stickerRef}>
          {constants.SELECT_LABELS.GENERIC_FULL}
        </h3>
        <div className={styles.form}>
          <Select
            size="large"
            placeholder={constants.SELECT_LABELS.MAKER}
            options={makerSelectOptions}
            value={getValueOrSlug(maker) || null}
            dropdownInDocumentFlow={isMobile}
            onChange={handleMakerChange}
            className={styles.select}
          />
          <Select
            size="large"
            placeholder={constants.SELECT_LABELS.MODEL}
            options={modelSelectOptions}
            value={getValueOrSlug(model) || null}
            disabled={!modelSelectOptions.length}
            dropdownInDocumentFlow={isMobile}
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
              dropdownInDocumentFlow={isMobile}
              className={styles.select}
            />
          )}
          <Button
            rightIcon="arrow-forward"
            className={styles.button}
            size="large"
            onClick={() => handleSave(params, reload)}
            disabled={!model}
          >
            See details
          </Button>
        </div>
      </Container>
    </div>
  );
}
