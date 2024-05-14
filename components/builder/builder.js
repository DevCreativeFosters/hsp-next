'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import StoreLocatorContext from '@contexts/store-locator';
import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import getRelatedCovers from '@lib/api/get-related-covers';
import normalizeUteBuilderProducts from '@lib/normalize-ute-builder-products';
import routes from '@lib/routes';

import ClashModal from '@components/builder/clash-modal';
import UTEChooseYourVehicle from '@components/builder/ute-choose-your-vehicle';
import Container from '@components/container/container';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';

import styles from './builder.module.scss';
import {
  getIncompatibleProducts,
  getOtherProductsWithSameParent,
  isProductSelected,
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
  noCover,
  products,
}) {
  const [openSection, setOpenSection] = useState(DEFAULT_OPEN_SECTION);
  const [disabledProducts, setDisabledProducts] = useState([]);
  const [covers, setCovers] = useState([]);
  const [stepProducts, setStepProducts] = useState(products);
  const [showClashModal, setShowClashModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productToAdd, setProductToAdd] = useState(null);
  const [incompatibleFactoryOptions, setIncompatibleFactoryOptions] =
    useState(null);
  const [incompatibleCovers, setIncompatibleCovers] = useState(null);
  const topRef = useRef(null);
  const isMobile = useIsMobile(1280);

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
      let incompatibleFactoryOptions = [];

      if (selectedFactoryOption?.length > 0) {
        incompatibleFactoryOptions = selectedFactoryOption
          .filter(
            option => !product.compatibleFactoryOptions.includes(option.slug),
          )
          .map(option => option.value);

        setIncompatibleFactoryOptions(incompatibleFactoryOptions);
      }

      const incompatibleCovers = selectedProducts
        .filter(
          selectedProduct =>
            !selectedProduct.productCategories.some(category =>
              product.compatibleCovers.includes(category),
            ),
        )
        .filter(cover => covers.some(c => c.group === cover.productSlug))
        .map(cover => cover.productName);

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

      setSelectedProducts(newSelectedProducts);
      setDisabledProducts(newDisabledProducts);
    },
    [
      covers,
      disabledProducts,
      selectedProducts,
      setGoToLink,
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
    group => {
      const products = [];
      stepProducts.forEach(item => {
        if (item.variants.length > 1 && item.group !== group.slug) {
          item.variants.forEach((variant, index) => {
            variant.isOpen = !variant.isOpen;

            if (index > 0) {
              variant.hidden = !variant.hidden;
            }
          });
        }
        products.push(item);
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

        const normalizedCovers = normalizeUteBuilderProducts(relatedCovers);
        const noCoverNormalized = normalizeUteBuilderProducts(noCover, true);
        const covers = [...normalizedCovers, ...noCoverNormalized];

        setStepProducts(covers);
        setCovers(covers);
      });
    },
    [globalOptions, make, model, noCover],
  );

  useEffect(
    function setBuilderStepProducts() {
      if (stepNumber === 1) {
        setStepProducts(covers);
      }

      if (stepNumber === 2) {
        setStepProducts(normalizeUteBuilderProducts(products));
      }
    },
    [covers, products, setStepProducts, stepNumber],
  );

  useEffect(
    function setBuilderSelectedCover() {
      if (!make || !model || stepNumber === 0) {
        return;
      }

      const selectedCover = selectedProducts.find(selectedProduct =>
        covers.some(cover => cover.group === selectedProduct.productSlug),
      );

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

      const products = [...selectedProducts, productToAdd];

      setSelectedProducts(products);
      setProductToAdd(null);
    },
    [productToAdd, selectedProducts, setSelectedProducts, showClashModal],
  );

  const isInlineMapVisible = Boolean(
    openSection === 'store' && !isMobile && isMapVisible,
  );

  const handleClashModalClose = () => {
    setShowClashModal(false);
  };

  const handleClashModalAccept = () => {
    if (selectedFactoryOption?.length > 0) {
      setSelectedFactoryOption(
        selectedFactoryOption.filter(
          option => !incompatibleFactoryOptions.includes(option.value),
        ),
      );
    }

    if (incompatibleCovers?.length > 0) {
      selectedProducts.shift();
    }

    const isCover = covers.some(
      cover => cover.group === currentProduct.productSlug,
    );

    if (isCover) {
      setProductToAdd(currentProduct);
    } else {
      setSelectedProducts([]);
    }

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
      <div className={styles.builder}>
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
          {stepNumber > 0 && stepProducts.length > 0 && (
            <ProductsCarousel
              disabledProducts={disabledProducts}
              isMobile={isMobile}
              products={stepProducts}
              selectedCover={selectedCover}
              selectedFactoryOption={selectedFactoryOption}
              selectedProducts={selectedProducts}
              stepNumber={stepNumber}
              stepTitle={stepTitle}
              toggleGroup={toggleGroup}
              toggleProduct={toggleProduct}
            />
          )}
        </Container>
      </div>
    </>
  );
}
