'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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
  params,
  variants,
}) {
  const wrapperRef = useRef();
  const stickerRef = useRef();
  const variantsNormalized = variants?.map(variant => {
    return {
      label: variant.productName,
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

  const [localParams, setLocalParams] = useState(params);
  const [isLoading, setIsLoading] = useState(false);

  const path = usePathname();

  const windowSize = useWindowSize();
  const isMobile = useIsMobile();

  const variantSlug = useMemo(() => {
    return path.split('/').pop();
  }, [path]);

  const reload = !getValueOrSlug(variant);

  useEffect(() => {
    if (maker && model && path) {
      setLocalParams({
        mainCategorySlug: path.slice(1),
        makeSlug: getValueOrSlug(maker),
        modelSlug: getValueOrSlug(model),
      });
    }
  }, [maker, model, path]);

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

  useEffect(
    function attachIntersectionObserver() {
      const { height, width } = windowSize;
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
    [windowSize.height, windowSize.width], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Container>
        <h3 className={styles.sticker} ref={stickerRef}>
          {constants.SELECT_LABELS.GENERIC_FULL}
        </h3>
        <div className={styles.form}>
          <Select
            className={styles.select}
            dropdownInDocumentFlow={isMobile}
            onChange={handleMakerChange}
            options={makerSelectOptions}
            placeholder={constants.SELECT_LABELS.MAKER}
            size="large"
            value={getValueOrSlug(maker) || null}
          />
          <Select
            className={styles.select}
            disabled={!modelSelectOptions.length}
            dropdownInDocumentFlow={isMobile}
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
              dropdownInDocumentFlow={isMobile}
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
            isBusy={isLoading}
            onClick={() => {
              handleSave(localParams, reload);
              setIsLoading(true);
            }}
            rightIcon="arrow-forward"
            size="large"
          >
            See details
          </Button>
        </div>
      </Container>
    </div>
  );
}
