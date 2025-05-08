'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import * as Sentry from '@sentry/nextjs';
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
  const [normalizedLocations, setNormalizedLocations] = useState([]);
  const topRef = useRef(null);
  const productsCarouselRef = useRef(null);
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
    isMapVisible,
    location,
    searchGeolocation,
    selectedStore,
    setSearchGeolocation,
    setSelectedStore,
  } = useContext(StoreLocatorContext);

  const shouldShowListResults = Boolean(
    location && searchGeolocation && !isMobile && !isMapVisible,
  );

  useEffect(
    function normalizeStoreLocations() {
      const normalized = normalizeStores(allLocations);
      setNormalizedLocations(normalized);
    },
    [allLocations],
  );

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
        // Find the product with complete compatibility data from stepProducts
        // First try to find it in variants
        let productWithCompatibilityData = stepProducts
          .flatMap(p => p.variants || [])
          .find(v => v.variantSlug === selectedProduct.variantSlug);

        // If not found in variants, try to find it directly in stepProducts
        if (!productWithCompatibilityData) {
          productWithCompatibilityData = stepProducts.find(
            p => p.variantSlug === selectedProduct.variantSlug,
          );
        }

        if (!productWithCompatibilityData) {
          Sentry.captureException(
            new Error(
              `Could not find product with compatibility data for: ${selectedProduct.variantSlug}`,
            ),
            { level: 'warning' },
          );
          return;
        }

        const otherProductsWithSameParent = getOtherProductsWithSameParent(
          stepProducts,
          productWithCompatibilityData.productSlug,
          productWithCompatibilityData.variantSlug,
        );

        const incompatibleProducts = getIncompatibleProducts(
          stepProducts,
          productWithCompatibilityData,
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

  const toggleGroup = useCallback(
    item => {
      const products = [];
      // Close any already opened groups if we're about to open a new one
      const isOpeningGroup = !item.variants[0].isOpen;

      if (isOpeningGroup) {
        stepProducts.forEach(product => {
          if (product.variants.length > 1 && product.group !== item.group) {
            const isGroupOpen = product.variants[0].isOpen;

            if (isGroupOpen) {
              product.variants.forEach((variant, index) => {
                variant.isOpen = false;

                if (index > 0) {
                  variant.hidden = true;
                }
              });
            }
          }
        });
      }

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

      // Handle carousel scroll – scroll to opened group first slide (header)
      if (isOpeningGroup && productsCarouselRef.current) {
        setTimeout(() => {
          const swiper = productsCarouselRef.current.swiper;
          if (!swiper) return;

          let firstSubitemIndex = null;
          let groupItemIndex = null;

          const slides = swiper.slides;

          // Find the group header
          groupItemIndex = Array.from(slides).findIndex(slide => {
            const button = slide.querySelector(
              'button[data-group-id="' + item.group + '"]',
            );
            return button !== null;
          });

          if (groupItemIndex === null) return;

          // Find the first subitem (next slide after the group header)
          if (groupItemIndex !== null && groupItemIndex + 1 < slides.length) {
            firstSubitemIndex = groupItemIndex + 1;
          } else {
            return;
          }

          if (firstSubitemIndex !== null) {
            const isGroupHeaderVisible = slides[
              groupItemIndex
            ].classList.contains('swiper-slide-visible');

            const slideToIndex = isGroupHeaderVisible
              ? groupItemIndex
              : firstSubitemIndex;

            productsCarouselRef.current.slideTo(slideToIndex, 300, true);
          }
        }, 100);
      }
    },
    [setStepProducts, stepProducts],
  );

  const toggleProduct = useCallback(
    product => {
      const isSelected = isProductSelected(
        selectedProducts,
        product.variantSlug,
      );
      setCurrentProduct(product);
      isSelected ? removeProduct(product) : addProduct(product);

      if (!isSelected) {
        const parentGroup = stepProducts.find(p =>
          p.variants.some(v => v.variantSlug === product.variantSlug),
        );
        if (parentGroup && parentGroup.variants.length > 1) {
          toggleGroup(parentGroup);
        }
      }
    },
    [addProduct, removeProduct, selectedProducts, stepProducts, toggleGroup],
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

      let updatedFirstProduct;
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
              updatedFirstProduct = variant;
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

      if (updatedFirstProduct && selectedProducts[0] !== updatedFirstProduct) {
        const updatedSelectedProducts = [...selectedProducts];
        updatedSelectedProducts[0] = updatedFirstProduct;
        setSelectedProducts(updatedSelectedProducts);
      }

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

  const isInlineMapVisible = Boolean(
    openSection === 'store' && !isMobile && isMapVisible,
  );

  const handleClashModalClose = () => {
    setShowClashModal(false);
  };

  const handleClashModalAccept = () => {
    setSelectedFactoryOption(null);

    let newSelectedProducts = selectedProducts.filter(product =>
      covers.some(cover => cover.group === product.productSlug),
    );

    if (selectedCover && !selectedCover.isNoCover) {
      const baseVariant = covers
        .find(cover => cover.group === selectedCover.productSlug)
        ?.variants.find(v => !v.compatibleFactoryOptionsVariants);

      if (baseVariant) {
        newSelectedProducts[0] = baseVariant;
        setSelectedCover(baseVariant);
      }
    }

    const compatibleExistingProducts = selectedProducts.filter(product => {
      if (covers.some(cover => cover.group === product.productSlug)) {
        return false;
      }

      const isCompatible = !getIncompatibleProducts(
        stepProducts,
        currentProduct,
        covers,
      ).some(incompatible => incompatible.variantSlug === product.variantSlug);

      return isCompatible;
    });

    newSelectedProducts = [
      ...newSelectedProducts,
      ...compatibleExistingProducts,
      currentProduct,
    ];

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

    setSelectedProducts(newSelectedProducts);
    setDisabledProducts(updatedDisabledProducts);
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
            {stepNumber > 0 ? (
              shouldShowListResults &&
              !selectedStore &&
              !isMapVisible ? null : (
                <Preview handleResetAccept={handleResetAccept}>
                  {/* Show map inside preview when map toggle is on or on mobile */}
                  {(isMapVisible || isInlineMapVisible) && (
                    <StoreLocatorMap
                      className={styles.map}
                      locations={normalizedLocations}
                      onMarkerClick={setSelectedStore}
                    />
                  )}
                </Preview>
              )
            ) : (
              <UTEChooseYourVehicle makes={makes} />
            )}
          </div>
          <ProductsCarousel
            disabledProducts={disabledProducts}
            handleResetAccept={handleResetAccept}
            isMobile={isMobile}
            products={stepProducts}
            ref={productsCarouselRef}
            removeProduct={removeProduct}
            toggleGroup={toggleGroup}
            toggleProduct={toggleProduct}
          />
        </Container>
      </div>
    </>
  );
}
