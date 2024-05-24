'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import StoreLocatorContext from '@contexts/store-locator';
import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import getNoCoverProduct from '@lib/api/get-no-cover-product';
import getRelatedCovers from '@lib/api/get-related-covers';
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
  const [openSection, setOpenSection] = useState(DEFAULT_OPEN_SECTION);
  const [disabledProducts, setDisabledProducts] = useState([]);
  const [covers, setCovers] = useState([]);
  const [noCoverProduct, setNoCoverProduct] = useState(null);
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
  const noCoverSlug = globalOptions?.noCoverCategory?.nodes[0]?.slug || null;

  const {
    maker: make,
    model,
    selectedCover,
    selectedFactoryOption,
    selectedProducts,
    setCompatibleFactoryOptions,
    setGoToLink,
    setSelectedCover,
    setSelectedFactoryOption,
    setSelectedProducts,
    setStepNumber,
    setStepTitle,
    stepNumber,
    stepTitle,
  } = useVehicleContext();

  const { filteredLocations, isMapVisible, setSelectedStore } =
    useContext(StoreLocatorContext);

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

      selectedProducts.forEach(selectedProduct => {
        if (selectedProduct.variantSlug !== product.variantSlug) {
          newSelectedProducts.push(selectedProduct);
        }
      });

      const otherProductsWithSameParent = getOtherProductsWithSameParent(
        stepProducts,
        product.productSlug,
        product.variantSlug,
      );

      const incompatibleProducts = [
        ...getIncompatibleProducts(stepProducts, product, covers),
      ];

      const newDisabledProducts = disabledProducts
        .filter(el => !otherProductsWithSameParent.includes(el))
        .filter(el => !incompatibleProducts.includes(el));

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

      setLastProductSlug(prevState => {
        return prevState;
      });

      setSelectedProducts(newSelectedProducts);
      setDisabledProducts(newDisabledProducts);
    },
    [
      covers,
      disabledProducts,
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

  useEffect(() => {
    if (!make || !model || !noCoverSlug) {
      return;
    }

    getNoCoverProduct(noCoverSlug, make.slug, model.slug).then(product => {
      if (!product) {
        return;
      }

      setNoCoverProduct(product);
    });
  }, [make, model, noCoverSlug]);

  useEffect(
    function getCompatibleFactoryOptions() {
      if (!make || !model || !makes.length) {
        return;
      }

      const compatibleFactoryOptions = makes
        .find(i => i.name === make.name)
        ?.models.find(j => j.name === model.name)?.compatibleFactoryOptions;

      setCompatibleFactoryOptions(compatibleFactoryOptions);
    },
    [make, makes, model, setCompatibleFactoryOptions],
  );

  useEffect(
    function getBuilderRelatedCovers() {
      if (!make?.slug || !model?.slug || !globalOptions?.coversCategory) {
        return;
      }

      getRelatedCovers(
        make.slug,
        model.slug,
        globalOptions.coversCategory.nodes[0].slug,
      ).then(relatedCovers => {
        if (!relatedCovers) {
          return;
        }

        const normalizedCovers = normalizeUteBuilderProducts(
          relatedCovers,
          true,
        );
        const noCoverNormalized = normalizeUteBuilderProducts(
          noCoverProduct,
          true,
          true,
        );
        const covers = [...normalizedCovers, ...noCoverNormalized];

        setStepProducts(covers);
        setCovers(covers);
      });
    },
    [globalOptions, make, model, noCoverProduct],
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
    },
    [products],
  );

  useEffect(
    function setBuilderSelectedCover() {
      if (!make || !model || stepNumber === 0) {
        return;
      }

      let selectedCover = selectedProducts.find(selectedProduct =>
        covers.some(cover => cover.group === selectedProduct.productSlug),
      );

      if (selectedFactoryOption && selectedCover && !selectedCover.isNoCover) {
        covers.forEach(cover => {
          cover.variants.forEach(variant => {
            const isCompatible =
              variant?.compatibleFactoryOptionsVariants?.includes(
                selectedFactoryOption.slug,
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
              <Preview
                make={make}
                model={model}
                selectedFactoryOption={selectedFactoryOption}
                selectedProducts={selectedProducts}
              >
                {isInlineMapVisible && (
                  <StoreLocatorMap
                    className={styles.map}
                    locations={filteredLocations}
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
            isMobile={isMobile}
            products={stepProducts}
            removeProduct={removeProduct}
            selectedCover={selectedCover}
            selectedFactoryOption={selectedFactoryOption}
            selectedProducts={selectedProducts}
            stepNumber={stepNumber}
            stepTitle={stepTitle}
            toggleGroup={toggleGroup}
            toggleProduct={toggleProduct}
          />
        </Container>
      </div>
    </>
  );
}
