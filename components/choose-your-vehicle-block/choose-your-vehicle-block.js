'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';
import AnimateHeight from 'react-animate-height';
import { useWindowSize } from 'usehooks-ts';

import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import { getProductsByCategoriesSlugs } from '@lib/api/get-products-by-categories-slugs';
import constants from '@lib/constants';
import { getValueOrSlug } from '@lib/helpers';
import { trimSlash } from '@lib/trim-slash';
import { useVehicleSelection } from '@lib/use-vehicle-select';

import Button from '@components/button/button';
import Container from '@components/container/container';
import Select from '@components/form/select';
import Loading from '@components/loading/loading';

import VehiclePreview from './choose-your-vehicle-block-preview';
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
  const [vehicleData, setVehicleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const path = usePathname();

  const windowSize = useWindowSize();
  const isMobile = useIsMobile();

  const mainCategorySlug = useMemo(() => path.split('/')[1], [path]);
  const makeSlug = useMemo(() => getValueOrSlug(maker), [maker]);
  const modelSlug = useMemo(() => getValueOrSlug(model), [model]);

  const errorMessage =
    'No vehicle data available. Please try different selections.';

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const variantSlug = useMemo(() => {
    return path.split('/').pop();
  }, [path]);

  const reload = !getValueOrSlug(variant);

  const mainCategory = mainCategorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const fetchVehicleData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const products = await getProductsByCategoriesSlugs(
        mainCategorySlug,
        makeSlug,
        modelSlug,
      );
      const firstMatch = products?.length ? products[0] : null;
      if (firstMatch) {
        const imageNodes = firstMatch.productFields.images?.nodes;
        const image =
          imageNodes && imageNodes[0]
            ? {
                alt: imageNodes[0].altText || 'Vehicle Preview',
                height: imageNodes[0].mediaDetails.height,
                url: imageNodes[0].mediaItemUrl,
                width: imageNodes[0].mediaDetails.width,
              }
            : null;

        setVehicleData({
          ...firstMatch,
          image: image,
        });
      } else {
        throw new Error(errorMessage);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch vehicle data.');
      setVehicleData(null);
    }
    setIsLoading(false);
  }, [mainCategorySlug, makeSlug, modelSlug]);

  useEffect(() => {
    if (maker && model && path) {
      setLocalParams({
        mainCategorySlug: path.slice(1),
        makeSlug: getValueOrSlug(maker),
        modelSlug: getValueOrSlug(model),
      });
    }
  }, [maker, model, path]);

  useEffect(() => {
    if (makeSlug && modelSlug) {
      fetchVehicleData();
    }
  }, [fetchVehicleData, makeSlug, modelSlug]);

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
            onClick={handleIsOpen}
            rightIcon="arrow-forward"
            size="large"
          >
            See details
          </Button>
        </div>

        <AnimateHeight
          contentClassName={styles.animateHeightContainer}
          duration={200}
          height={isOpen ? 'auto' : 0}
        >
          {isLoading ? (
            <div className={styles.loader}>
              <Loading color="white" size="large" />
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          ) : vehicleData ? (
            <VehiclePreview
              category={mainCategory}
              description={vehicleData?.productFields.description}
              image={vehicleData?.image}
              make={maker?.name}
              model={model?.name}
              onEnquire={() => {
                handleSave(localParams, reload);
                setIsLoading(true);
              }}
              price={vehicleData?.productFields.price}
            />
          ) : (
            <div className={styles.error}>
              <p>{errorMessage}</p>
            </div>
          )}
        </AnimateHeight>
      </Container>
    </div>
  );
}
