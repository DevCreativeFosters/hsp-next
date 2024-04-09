'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import StoreLocatorContext from '@contexts/store-locator';
import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import getCompatibilityData from '@lib/api/get-compatibility-data';
import getRelatedCovers from '@lib/api/get-related-covers';
import normalizeUteBuilderProducts, {
  normalizeCompatibilityData,
} from '@lib/normalize-ute-builder-products';

import ClashModal from '@components/builder/clash-modal';
import UTEChooseYourVehicle from '@components/builder/ute-choose-your-vehicle';
import Container from '@components/container/container';
import StoreList from '@components/store-list/store-list';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';

import styles from './builder.module.scss';
import Preview from './preview';
import ProductsCarousel from './products-carousel';
import Sidebar from './sidebar';

const getOtherProductsWithSameParent = (products, productSlug, variantSlug) =>
  products.filter(
    product =>
      product.productSlug === productSlug &&
      product.variantSlug !== variantSlug,
  );

const DEFAULT_OPEN_SECTION = 'products';
export const STEP_TITLES = {
  1: 'Add your UTE covering',
  2: 'Add your accessories',
};

export default function Builder({
  makes,
  products,
  noCover,
  allLocations,
  factoryOptions,
  globalOptions,
}) {
  const [openSection, setOpenSection] = useState(DEFAULT_OPEN_SECTION);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [disabledProducts, setDisabledProducts] = useState([]);
  const [topHeight, setHeight] = useState(0);
  const [covers, setCovers] = useState([]);
  const [stepProducts, setStepProducts] = useState(products);
  const [compatibilityData, setCompatibilityData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [coverSelected, setCoverSelected] = useState(false);
  const topRef = useRef(null);
  const isMobile = useIsMobile(1280);

  const {
    maker: make,
    model,
    factoryOption,
    stepNumber,
    stepTitle,
    setStepNumber,
    setStepTitle,
    setFactoryOption,
  } = useVehicleContext();

  const {
    location,
    searchGeolocation,
    filteredLocations,
    selectedStore,
    setSelectedStore,
    isMapVisible,
    radius,
  } = useContext(StoreLocatorContext);

  useEffect(() => {
    if (
      !make?.slug ||
      !model?.slug ||
      !globalOptions ||
      !globalOptions?.coversCategory
    ) {
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
      const covers = [...normalizedCovers, ...noCover];

      setStepProducts(covers);
      setCovers(covers);
    });

    getCompatibilityData(globalOptions.coversCategory.nodes[0].databaseId).then(
      data => {
        if (!data) {
          return;
        }

        const normalizedData = normalizeCompatibilityData(data);
        setCompatibilityData(normalizedData);
      },
    );
  }, [make, model, globalOptions, noCover]);

  useEffect(() => {
    if (stepNumber === 0) {
      return;
    }

    const newStep = coverSelected ? 2 : 1;

    setStepNumber(newStep);
    setStepTitle(STEP_TITLES[newStep]);
  }, [stepNumber, coverSelected, setStepNumber, setStepTitle]);

  useEffect(() => {
    const coverSelected = selectedProducts.some(selectedProduct =>
      covers.some(cover => cover.productSlug === selectedProduct.productSlug),
    );

    setCoverSelected(coverSelected);
  }, [selectedProducts, covers, setCoverSelected]);

  useEffect(() => {
    if (stepNumber === 1) {
      setStepProducts(covers);
    }

    if (stepNumber === 2) {
      setStepProducts(products);
    }
  }, [stepNumber, products, setStepProducts, covers]);

  useEffect(function setTopHeightObserver() {
    if (!topRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      setHeight(topRef.current?.getBoundingClientRect().height);
    });
    resizeObserver.observe(topRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const addProduct = useCallback(
    product => {
      let newSelectedProducts = [...selectedProducts, product];

      if (covers.some(cover => cover.productSlug === product.productSlug)) {
        if (!factoryOption) {
          newSelectedProducts = [product, ...selectedProducts];
          setSelectedProducts(newSelectedProducts);

          return;
        }

        const isCompatibleWithFactoryOptions = compatibilityData[
          product.productSlug
        ]?.factoryOptions.filter(option => option.slug === factoryOption.slug);

        if (!isCompatibleWithFactoryOptions) {
          setShowModal(true);
          return;
        }

        newSelectedProducts = [product, ...selectedProducts];
      }

      const newDisabledProducts = [
        ...disabledProducts,
        ...getOtherProductsWithSameParent(
          products,
          products.productSlug,
          products.variantSlug,
        ),
      ];

      setSelectedProducts(newSelectedProducts);
      setDisabledProducts(newDisabledProducts);
    },
    [
      selectedProducts,
      disabledProducts,
      products,
      factoryOption,
      covers,
      compatibilityData,
    ],
  );

  const removeProduct = useCallback(
    product => {
      const newSelectedProducts = selectedProducts.filter(
        selectedProduct => selectedProduct !== product,
      );
      const otherProductsWithSameParent = getOtherProductsWithSameParent(
        products,
        product.productSlug,
        product.variantSlug,
      );
      const newDisabledProducts = disabledProducts.filter(
        el => !otherProductsWithSameParent.includes(el),
      );

      setSelectedProducts(newSelectedProducts);
      setDisabledProducts(newDisabledProducts);
    },
    [selectedProducts, disabledProducts, products],
  );

  const toggleProduct = useCallback(
    product => {
      setCurrentProduct(product);
      selectedProducts.includes(product)
        ? removeProduct(product)
        : addProduct(product);
    },
    [selectedProducts, addProduct, removeProduct],
  );

  const isInlineResultListVisible = Boolean(
    openSection === 'store' && location && searchGeolocation && radius,
  );
  const isInlineMapVisible = Boolean(
    openSection === 'store' && !isMobile && isMapVisible,
  );

  return (
    <>
      {showModal ? (
        <ClashModal
          setShowModal={setShowModal}
          factoryOption={factoryOption}
          currentProduct={currentProduct}
          setFactoryOption={setFactoryOption}
          setSelectedProducts={setSelectedProducts}
        />
      ) : (
        <div className={styles.builder}>
          <Container className={styles.container}>
            <div className={styles.top} ref={topRef}>
              <Sidebar
                openSection={openSection}
                setOpenSection={setOpenSection}
                selectedProducts={selectedProducts}
                removeProduct={removeProduct}
                isMobile={isMobile}
                allLocations={allLocations}
              />
              <StoreList
                className={styles.results}
                items={filteredLocations}
                show={isInlineResultListVisible}
                onSelect={item => {
                  setSelectedStore(item);
                }}
                style={{
                  height: selectedStore ? topHeight : null,
                }}
              />
              {stepNumber > 0 ? (
                <Preview
                  make={make}
                  model={model}
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
                <UTEChooseYourVehicle
                  makes={makes}
                  factoryOptions={factoryOptions}
                />
              )}
            </div>
            {stepNumber > 0 && stepProducts.length > 0 && (
              <ProductsCarousel
                products={stepProducts}
                selectedProducts={selectedProducts}
                disabledProducts={disabledProducts}
                toggleProduct={toggleProduct}
                stepNumber={stepNumber}
                stepTitle={stepTitle}
              />
            )}
          </Container>
        </div>
      )}
    </>
  );
}
