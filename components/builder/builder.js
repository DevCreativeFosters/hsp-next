'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import StoreLocatorContext from '@contexts/store-locator';
import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import getRelatedCovers from '@lib/api/get-related-covers';
import normalizeStores from '@lib/normalize-stores';
import normalizeUteBuilderProducts from '@lib/normalize-ute-builder-products';
import routes from '@lib/routes';

import ClashModal from '@components/builder/clash-modal';
import UTEChooseYourVehicle from '@components/builder/ute-choose-your-vehicle';
import Container from '@components/container/container';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';

import styles from './builder.module.scss';
import {
  filterOutIncompatibleProducts,
  getIncompatibleCovers,
  getIncompatibleFactoryOptions,
  getIncompatibleProducts,
  getOtherProductsWithSameParent,
  isProductSelected,
  sortProducts,
  updateSelectedCoverVariant,
} from './helpers';
import Preview from './preview';
import ProductsCarousel from './products-carousel';
import Sidebar from './sidebar';

const DEFAULT_OPEN_SECTION = 'products';
export const STEP_TITLES = {
  1: 'Add your UTE covering',
  2: {
    desktop: 'Add products to your vehicle',
    mobile: 'Add products to',
  },
};

export default function Builder({
  allLocations,
  globalOptions,
  makes,
  products,
}) {
  const [isFetchingCovers, setIsFetchingCovers] = useState(false);
  const [openSection, setOpenSection] = useState(DEFAULT_OPEN_SECTION);
  const [disabledProducts, setDisabledProducts] = useState([]);
  const [stepProducts, setStepProducts] = useState(products);
  const [showClashModal, setShowClashModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productToAdd, setProductToAdd] = useState(null);
  const [incompatibleFactoryOptions, setIncompatibleFactoryOptions] =
    useState(null);
  const [incompatibleCovers, setIncompatibleCovers] = useState(null);
  const [lastProductSlug, setLastProductSlug] = useState(null);
  const topRef = useRef(null);
  const isMobile = useIsMobile(1280);

  const {
    covers,
    maker: make,
    model,
    selectedCover,
    selectedFactoryOption,
    selectedProducts,
    setCompatibleFactoryOptions,
    setCovers,
    setGoToLink,
    setSelectedCover,
    setSelectedFactoryOption,
    setSelectedProducts,
    setStepNumber,
    setStepTitle,
    stepNumber,
  } = useVehicleContext();

  const {
    filteredLocations,
    filteredStores,
    isInlineResultListVisible,
    isMapVisible,
    searchGeolocation,
    setFilteredStores,
    setSearchGeolocation,
    setSelectedStore,
  } = useContext(StoreLocatorContext);

  const [normalizedLocations, setNormalizedLocations] = useState([]);

  useEffect(() => {
    const normalized = normalizeStores(allLocations);
    setNormalizedLocations(normalized);
  }, [allLocations]);

  const addProduct = useCallback(
    product => {
      const incompatibleFactoryOptions = getIncompatibleFactoryOptions(
        selectedFactoryOption,
        product,
        stepNumber,
      );

      const incompatibleCovers = getIncompatibleCovers(
        selectedProducts,
        product,
        covers,
      );

      setIncompatibleFactoryOptions(incompatibleFactoryOptions);
      setIncompatibleCovers(incompatibleCovers);

      if (
        incompatibleFactoryOptions.length > 0 ||
        incompatibleCovers.length > 0
      ) {
        setShowClashModal(true);
        return;
      }

      if (stepNumber === 2) {
        const newDisabledProducts = [
          ...disabledProducts,
          ...getOtherProductsWithSameParent(
            stepProducts,
            product.productSlug,
            product.variantSlug,
          ),
          ...getIncompatibleProducts(stepProducts, product, covers),
        ];

        setDisabledProducts(newDisabledProducts);
      }

      setLastProductSlug(product.productSlug);
      setProductToAdd(product);
    },
    [
      covers,
      disabledProducts,
      selectedFactoryOption,
      selectedProducts,
      stepNumber,
      stepProducts,
    ],
  );

  const removeProduct = useCallback(
    product => {
      let newSelectedProducts = [];
      const isCover = covers.some(cover => cover.group === product.productSlug);

      if (isCover) {
        setGoToLink(routes.uteBuilder);
        return;
      }

      newSelectedProducts = selectedProducts.filter(
        selectedProduct => selectedProduct.variantSlug !== product.variantSlug,
      );

      let updatedDisabledProducts = [];

      newSelectedProducts.forEach(selectedProduct => {
        const otherProductsWithSameParent = getOtherProductsWithSameParent(
          stepProducts,
          selectedProduct.productSlug,
          selectedProduct.variantSlug,
        );

        const incompatibleProducts = getIncompatibleProducts(
          stepProducts,
          selectedProduct,
          covers,
        );

        updatedDisabledProducts = [
          ...new Set([
            ...updatedDisabledProducts,
            ...otherProductsWithSameParent,
            ...incompatibleProducts,
          ]),
        ];
      });

      updatedDisabledProducts = updatedDisabledProducts.filter(
        disabledProduct =>
          !newSelectedProducts.some(
            selectedProduct =>
              selectedProduct.variantSlug === disabledProduct.variantSlug,
          ),
      );

      if (
        newSelectedProducts.length === 1 &&
        !newSelectedProducts[0].isNoCover
      ) {
        const selectedCoverIndex =
          covers.findIndex(
            cover => cover.group === newSelectedProducts[0].productSlug,
          ) || 0;

        const newVariant = covers[selectedCoverIndex].variants[0];

        setSelectedCover(newVariant);
        newSelectedProducts[0] = newVariant;
      }

      setLastProductSlug(prevState => prevState);
      setSelectedProducts(newSelectedProducts);
      setDisabledProducts(updatedDisabledProducts);
    },
    [
      covers,
      selectedProducts,
      setGoToLink,
      setSelectedCover,
      setSelectedProducts,
      stepProducts,
    ],
  );

  const toggleProduct = useCallback(
    product => {
      const isSelected = isProductSelected(
        selectedProducts,
        product.variantSlug,
      );
      setCurrentProduct(product);
      isSelected ? removeProduct(product) : addProduct(product);
    },
    [addProduct, removeProduct, selectedProducts],
  );

  const toggleGroup = useCallback(
    item => {
      const products = [];
      stepProducts.forEach(product => {
        if (product.variants.length > 1 && product.group === item.group) {
          product.variants.forEach((variant, index) => {
            variant.isOpen = !variant.isOpen;

            if (!variant.isOpen) {
              setLastProductSlug(null);
            }

            if (index > 0) {
              variant.hidden = !variant.hidden;
            }
          });
        }

        products.push(product);
      });

      setStepProducts(products);
    },
    [setStepProducts, stepProducts],
  );

  useEffect(
    function getCompatibleFactoryOptions() {
      if (!make || !model || !makes.length) {
        return;
      }

      const compatibleFactoryOptions = makes
        .find(i => i.name === make.name)
        ?.models.find(j => j.name === model.name)?.compatibleFactoryOptions;

      setCompatibleFactoryOptions(sortProducts(compatibleFactoryOptions));
    },
    [make, makes, model, setCompatibleFactoryOptions],
  );

  useEffect(
    function getBuilderRelatedCovers() {
      if (
        !make?.slug ||
        !model?.slug ||
        !globalOptions?.coversCategory ||
        stepNumber === 0 ||
        isFetchingCovers ||
        covers.length > 0
      ) {
        return;
      }

      setIsFetchingCovers(true);

      getRelatedCovers(
        make.slug,
        model.slug,
        globalOptions.coversCategory.nodes[0].slug,
      )
        .then(relatedCovers => {
          if (!relatedCovers) {
            setCovers([]);
            return;
          }

          const normalizedCovers = normalizeUteBuilderProducts(
            relatedCovers,
            true,
          );

          setCovers(normalizedCovers);
          setIsFetchingCovers(false);
        })
        .catch(error => {
          console.error(error);
          setIsFetchingCovers(false);
        });
    },
    [
      covers,
      globalOptions,
      isFetchingCovers,
      make,
      model,
      setCovers,
      stepNumber,
    ],
  );

  useEffect(
    function setBuilderStepProducts() {
      if (stepNumber === 1) {
        setStepProducts(covers);
      }

      if (stepNumber === 2) {
        const filteredOutProducts = filterOutIncompatibleProducts(
          products,
          selectedCover,
        );

        setStepProducts(
          normalizeUteBuilderProducts(
            filteredOutProducts,
            false,
            lastProductSlug,
          ),
        );
      }
    },
    [
      covers,
      lastProductSlug,
      products,
      selectedCover,
      selectedProducts,
      setStepProducts,
      stepNumber,
    ],
  );

  useEffect(
    function removeStepProducts() {
      setStepProducts([]);
      setSelectedProducts([]);
      setSelectedCover(null);
    },
    [products, setSelectedCover, setSelectedProducts],
  );

  useEffect(
    function setBuilderSelectedCover() {
      if (!make || !model || stepNumber === 0 || !covers.length) {
        return;
      }

      let selectedCover = selectedProducts.find(selectedProduct =>
        covers.some(cover => cover.group === selectedProduct.productSlug),
      );

      if (selectedFactoryOption && selectedCover && !selectedCover.isNoCover) {
        const selectedFactoryOptionCategorySlug =
          selectedFactoryOption?.productCategories?.nodes[0]?.slug || null;

        if (!selectedFactoryOptionCategorySlug) {
          return;
        }

        covers.forEach(cover => {
          cover.variants.forEach(variant => {
            const isCompatible =
              variant?.compatibleFactoryOptionsVariants?.includes(
                selectedFactoryOptionCategorySlug,
              ) || false;

            if (isCompatible) {
              variant.image = selectedCover.image;
              selectedCover = variant;
              selectedProducts[0] = variant;
            }
          });
        });
      }

      if (!selectedCover) {
        setStepNumber(1);
        setStepTitle(STEP_TITLES[1]);

        return;
      }

      const key = isMobile ? 'mobile' : 'desktop';

      setStepNumber(2);
      setStepTitle(STEP_TITLES[2][key]);
      setSelectedCover(selectedCover);
    },
    [
      covers,
      isMobile,
      make,
      model,
      selectedFactoryOption,
      selectedProducts,
      setSelectedCover,
      setStepNumber,
      setStepTitle,
      stepNumber,
    ],
  );

  useEffect(
    function addProduct() {
      if (!productToAdd || showClashModal) {
        return;
      }

      let products = [...selectedProducts, productToAdd];

      if (selectedCover && !selectedCover.isNoCover) {
        const data = updateSelectedCoverVariant(
          covers,
          selectedCover,
          products,
          productToAdd,
        );

        products = data.products;

        setSelectedCover(data.cover);
      }

      setSelectedProducts(products);
      setProductToAdd(null);
    },
    [
      covers,
      productToAdd,
      selectedCover,
      selectedProducts,
      setSelectedCover,
      setSelectedProducts,
      showClashModal,
    ],
  );

  useEffect(
    function resetDisabledProducts() {
      if (stepNumber < 2) {
        setDisabledProducts([]);
      }
    },
    [stepNumber],
  );

  useEffect(
    function resetAvailableCovers() {
      if (stepNumber === 0 && covers.length > 0) {
        setCovers([]);
      }
    },
    [covers.length, stepNumber],
  );

  // useEffect(
  //   function syncStoresWithMap() {
  //     if (searchGeolocation) {
  //       setFilteredStores(
  //         findLocationsInRadius(searchGeolocation, filteredLocations),
  //       );
  //     }
  //   },
  //   [filteredLocations, searchGeolocation, setFilteredStores],
  // );

  const isInlineMapVisible = Boolean(
    openSection === 'store' && !isMobile && isMapVisible,
  );

  const handleClashModalClose = () => {
    setShowClashModal(false);
  };

  const handleClashModalAccept = () => {
    setSelectedFactoryOption(null);

    if (!selectedCover?.isNoCover) {
      const data = updateSelectedCoverVariant(
        covers,
        selectedCover,
        selectedProducts,
        currentProduct,
      );

      setSelectedCover(data.cover);
      setSelectedProducts(data.products);
    }

    setProductToAdd(currentProduct);
    setDisabledProducts([
      ...getIncompatibleProducts(stepProducts, currentProduct, covers),
    ]);
    setShowClashModal(false);
  };

  const handleResetAccept = () => {
    setSelectedCover(null);
    setSelectedProducts([]);
    setSelectedStore(null);
    setSearchGeolocation(null);
    setStepNumber(0);
  };

  return (
    <>
      {showClashModal && (
        <ClashModal
          incompatibleCovers={incompatibleCovers}
          incompatibleFactoryOptions={incompatibleFactoryOptions}
          onAccept={handleClashModalAccept}
          onClose={handleClashModalClose}
        />
      )}
      <div className={clsx(styles.builder, 'uteBuilder')}>
        <Container className={styles.container}>
          <div className={styles.top} ref={topRef}>
            <Sidebar
              allLocations={allLocations}
              globalOptions={globalOptions}
              isMobile={isMobile}
              openSection={openSection}
              removeProduct={removeProduct}
              selectedProducts={selectedProducts}
              setOpenSection={setOpenSection}
              stepNumber={stepNumber}
            />
            {/* <div className={styles.mobileOnly}>
              <StoreList
                items={filteredStores}
                onSelect={item => {
                  setCurrentResult(item);
                  setViewMode('RESULT');
                }}
                show={isInlineResultListVisible}
              />
            </div> */}
            {stepNumber > 0 ? (
              <Preview handleResetAccept={handleResetAccept}>
                {isInlineMapVisible && (
                  <StoreLocatorMap
                    className={styles.map}
                    locations={normalizedLocations}
                    onMarkerClick={setSelectedStore}
                  />
                )}
              </Preview>
            ) : (
              <UTEChooseYourVehicle makes={makes} />
            )}
          </div>
          <ProductsCarousel
            disabledProducts={disabledProducts}
            handleResetAccept={handleResetAccept}
            isMobile={isMobile}
            products={stepProducts}
            removeProduct={removeProduct}
            toggleGroup={toggleGroup}
            toggleProduct={toggleProduct}
          />
        </Container>
      </div>
    </>
  );
}
