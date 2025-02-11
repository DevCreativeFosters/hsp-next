'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import AnimateHeight from 'react-animate-height';
import { useWindowSize } from 'usehooks-ts';

import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import { getAllProductMakesAndModelsByCategory } from '@lib/api/get-all-product-makes-and-models-by-category';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getProductsByCategoriesSlugs } from '@lib/api/get-products-by-categories-slugs';
import constants from '@lib/constants';
import filterMakesByCategory from '@lib/filter-makes-by-category';
import { getValueOrSlug } from '@lib/helpers';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import routes from '@lib/routes';
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
  const [maker, setMaker] = useState({
    name: '',
    slug: '',
  });
  const [model, setModel] = useState({
    name: '',
    slug: '',
  });
  const wrapperRef = useRef();
  const stickerRef = useRef();
  const variantsNormalized = variants?.map(variant => {
    return {
      label: variant.productName,
      value: variant.variantSlug,
    };
  });
  const { setVariant, setVehicleSelection, variant } = useVehicleContext();
  const { handleVariantChange, modelSelectOptions } = useVehicleSelection(
    makersAndModels,
    setVehicleSelection,
    maker,
  );

  const [localParams, setLocalParams] = useState(params);
  const [vehicleData, setVehicleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredMakeSelectOptions, setFilteredMakeSelectOptions] = useState(
    [],
  );
  const [filteredMakes, setFilteredMakes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  const path = usePathname();
  const router = useRouter();

  const windowSize = useWindowSize();
  const isMobile = useIsMobile();
  const [isSticky] = useState(false);

  const mainCategorySlug = useMemo(() => path.split('/')[1], [path]);
  const makeSlug = useMemo(() => getValueOrSlug(maker), [maker]);
  const modelSlug = useMemo(() => getValueOrSlug(model), [model]);

  const fetchAvailableModels = useCallback(async () => {
    if (!makeSlug) return;

    setIsLoading(true);
    setError(null);

    try {
      const selectedMake = makersAndModels.find(make => make.slug === makeSlug);

      if (!selectedMake || !selectedMake.models) {
        setAvailableModels([]);
        return;
      }

      const modelPromises = selectedMake.models.map(async model => {
        const products = await getProductsByCategoriesSlugs(
          mainCategorySlug,
          makeSlug,
          model.slug,
        );
        return products?.length
          ? { label: model.name, value: model.slug }
          : null;
      });

      const results = await Promise.all(modelPromises);
      const available = results.filter(Boolean);

      setAvailableModels(available);
    } catch (err) {
      console.error('Error fetching model availability:', err);
      setError('Failed to fetch available models.');
    } finally {
      setIsLoading(false);
    }
  }, [mainCategorySlug, makersAndModels, makeSlug]);

  useEffect(
    function filterModelsByMake() {
      if (makeSlug) {
        fetchAvailableModels();
      }
    },
    [fetchAvailableModels, makeSlug],
  );

  useEffect(
    function getCategoriesMakes() {
      let isMounted = true;

      async function fetchData() {
        try {
          const categoryMakesAndModels = await getCategoriesMakesAndModels();
          if (!isMounted) return;
          const categories = formatCategories(categoryMakesAndModels);
          setFilteredMakes(filterMakesByCategory(categories, mainCategorySlug));
        } catch (error) {
          console.error('Error fetching categories and makes:', error);
        }
      }

      fetchData();

      return () => {
        isMounted = false;
      };
    },
    [mainCategorySlug],
  );

  useEffect(
    function filterMakeSelectOptions() {
      const filterMakeOptions = async () => {
        const products =
          await getAllProductMakesAndModelsByCategory(mainCategorySlug);

        const validMakeSlugs = new Set(
          products.flatMap(product =>
            product.makesAndModels?.nodes
              ?.map(node => node.slug)
              .filter(Boolean),
          ),
        );

        const filteredMakeOptions = filteredMakes.reduce((acc, make) => {
          if (validMakeSlugs.has(make.slug)) {
            acc.push({ label: make.name, value: make.slug });
          }
          return acc;
        }, []);

        setFilteredMakeSelectOptions(filteredMakeOptions);
      };

      filterMakeOptions();
    },
    [filteredMakes, mainCategorySlug],
  );

  const errorMessage =
    'The Vehicle you have selected is not compatible with this product. Please change your vehicle or find compatible products below.';

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectionChange = useCallback(
    (options, setState, clearState, clearList) => value => {
      const selectedOption = options.find(option => option.value === value);
      if (selectedOption) {
        setState({
          name: selectedOption.label,
          slug: selectedOption.value,
        });
        if (clearState) {
          clearState({ name: '', slug: '' });
        }
        if (clearList) {
          clearList([]);
        }
      }
    },
    [],
  );

  const variantSlug = useMemo(() => {
    return path.split('/').pop();
  }, [path]);

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
        const mainDescription = firstMatch.productFields?.description;
        const mainPrice = firstMatch.productFields?.price;
        const mainImageNodes = firstMatch.productFields?.images?.nodes;
        const mainImage =
          mainImageNodes && mainImageNodes[0]
            ? {
                alt: mainImageNodes[0].altText || 'Vehicle Preview',
                height: mainImageNodes[0].mediaDetails.height,
                url: mainImageNodes[0].mediaItemUrl,
                width: mainImageNodes[0].mediaDetails.width,
              }
            : null;

        const fallbackDescription =
          firstMatch.productFields?.variants?.[0]?.variantDetails?.description;
        const fallbackPrice =
          firstMatch.productFields?.variants?.[0]?.variantDetails?.price;
        const fallbackImageNodes =
          firstMatch.productFields?.variants?.[0]?.variantDetails?.images
            ?.nodes;
        const fallbackImage =
          fallbackImageNodes && fallbackImageNodes[0]
            ? {
                alt: fallbackImageNodes[0].altText || 'Vehicle Preview',
                height: fallbackImageNodes[0].mediaDetails.height,
                url: fallbackImageNodes[0].mediaItemUrl,
                width: fallbackImageNodes[0].mediaDetails.width,
              }
            : null;

        setVehicleData({
          ...firstMatch,
          description:
            mainDescription ||
            fallbackDescription ||
            'No description available.',
          image: mainImage ||
            fallbackImage || {
              alt: 'No image available',
              height: 0,
              url: '',
              width: 0,
            },
          price: mainPrice || fallbackPrice,
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
      const stickerHeight = stickerEl?.clientHeight;
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

  if (isMobile) {
    return null;
  }

  return (
    <div
      className={clsx(styles.wrapper, { [styles.isSticky]: isSticky })}
      ref={wrapperRef}
    >
      <Container>
        <h3 className={styles.sticker} ref={stickerRef}>
          {constants.SELECT_LABELS.GENERIC_FULL}
        </h3>
        <div className={styles.form}>
          {!filteredMakeSelectOptions.length ? (
            <Loading color="white" size="large" />
          ) : (
            <>
              <Select
                className={styles.select}
                disabled={!filteredMakeSelectOptions.length}
                dropdownInDocumentFlow={isMobile}
                onChange={handleSelectionChange(
                  filteredMakeSelectOptions,
                  setMaker,
                  setModel,
                  setAvailableModels,
                )}
                options={filteredMakeSelectOptions}
                placeholder={constants.SELECT_LABELS.MAKER}
                size="large"
                value={getValueOrSlug(maker) || null}
              />
              <Select
                className={styles.select}
                disabled={!availableModels.length}
                dropdownInDocumentFlow={isMobile}
                onChange={handleSelectionChange(availableModels, setModel)}
                options={availableModels}
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
                disabled={!getValueOrSlug(model)}
                isBusy={isLoading}
                onClick={handleIsOpen}
                rightIcon="arrow-forward"
                size="large"
              >
                See details
              </Button>
            </>
          )}
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
              description={vehicleData?.description}
              image={vehicleData?.image}
              make={maker?.name}
              model={model?.name}
              onEnquire={() => {
                const { mainCategorySlug, makeSlug, modelSlug } = localParams;

                const newRoute = routes.product(
                  mainCategorySlug,
                  makeSlug,
                  modelSlug,
                );

                router.push(newRoute);
                setIsLoading(true);
              }}
              price={vehicleData?.price}
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
