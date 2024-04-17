'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import StoreLocatorContext from '@contexts/store-locator';
import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import getRelatedCovers from '@lib/api/get-related-covers';
import normalizeUteBuilderProducts from '@lib/normalize-ute-builder-products';

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
  products
    .filter(product => product.group === productSlug)
    .flatMap(product => product.variants)
    .filter(variant => variant.variantSlug !== variantSlug)
    .filter(variant => variant.variantSlug)
    .map(variant => {
      return variant.variantSlug;
    });

const getIncompatibleProducts = (products, currentProduct) =>
  products
    .filter(product => product.group !== currentProduct.productSlug)
    .flatMap(product => product.variants)
    .filter(variant => variant.productSlug !== currentProduct.productSlug)
    .filter(
      variant =>
        variant.productCategories &&
        variant.productCategories.some(
          category => !currentProduct.compatibleProducts.includes(category),
        ),
    )
    .filter(variant => variant.variantSlug)
    .map(variant => variant.variantSlug);

const DEFAULT_OPEN_SECTION = 'products';
export const STEP_TITLES = {
  1: 'Add your UTE covering',
  2: 'Add products to your vehicle',
};

export default function Builder({
  allLocations,
  factoryOptions,
  globalOptions,
  makes,
  noCover,
  products,
}) {
  const [openSection, setOpenSection] = useState(DEFAULT_OPEN_SECTION);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [disabledProducts, setDisabledProducts] = useState([]);
  const [topHeight, setHeight] = useState(0);
  const [covers, setCovers] = useState([]);
  const [stepProducts, setStepProducts] = useState(products);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isCover, setIsCover] = useState(false);
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
    selectedFactoryOptions,
    setSelectedCover,
    setSelectedFactoryOptions,
    setStepNumber,
    setStepTitle,
    stepNumber,
    stepTitle,
  } = useVehicleContext();

  const {
    filteredLocations,
    isMapVisible,
    location,
    radius,
    searchGeolocation,
    selectedStore,
    setSelectedStore,
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
      const noCoverNormalized = normalizeUteBuilderProducts(noCover);
      const covers = [...normalizedCovers, ...noCoverNormalized];

      setStepProducts(covers);
      setCovers(covers);
    });
  }, [globalOptions, make, model, noCover]);

  useEffect(() => {
    if (stepNumber === 1) {
      setStepProducts(covers);
    }

    if (stepNumber === 2) {
      setStepProducts(normalizeUteBuilderProducts(products));
    }
  }, [covers, products, setStepProducts, stepNumber]);

  useEffect(() => {
    if (!make || !model || stepNumber === 0) {
      return;
    }

    const selectedCover = selectedProducts.find(selectedProduct =>
      covers.some(cover => cover.group === selectedProduct.productSlug),
    );

    setStepNumber(selectedCover ? 2 : 1);
    setStepTitle(STEP_TITLES[selectedCover ? 2 : 1]);
    setSelectedCover(selectedCover);
  }, [
    covers,
    make,
    model,
    selectedProducts,
    setSelectedCover,
    setStepNumber,
    setStepTitle,
    stepNumber,
  ]);

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
      setIsCover(covers.some(cover => cover.group === product.productSlug));

      const incompatibleFactoryOptions = selectedFactoryOptions
        .filter(
          option => !product.compatibleFactoryOptions.includes(option.slug),
        )
        .map(option => option.value);

      const incompatibleCovers = selectedProducts
        .filter(
          selectedProduct =>
            !product.compatibleCovers.includes(selectedProduct.productSlug),
        )
        .map(cover => cover.productName);

      setIncompatibleFactoryOptions(incompatibleFactoryOptions);
      setIncompatibleCovers(incompatibleCovers);

      if (
        incompatibleFactoryOptions.length > 0 ||
        incompatibleCovers.length > 0
      ) {
        setShowModal(true);

        return;
      }

      const newDisabledProducts = [
        ...disabledProducts,
        ...getOtherProductsWithSameParent(
          stepProducts,
          product.productSlug,
          product.variantSlug,
        ),
        ...getIncompatibleProducts(stepProducts, product),
      ];

      setDisabledProducts(newDisabledProducts);

      setProductToAdd(product);
    },
    [
      covers,
      disabledProducts,
      selectedFactoryOptions,
      selectedProducts,
      stepProducts,
    ],
  );

  useEffect(() => {
    if (!productToAdd || showModal) {
      return;
    }

    const products = [...selectedProducts];

    if (isCover) {
      products.unshift(productToAdd);
    } else {
      products.push(productToAdd);
    }

    setSelectedProducts(products);
    setProductToAdd(null);
  }, [isCover, productToAdd, selectedProducts, showModal]);

  const removeProduct = useCallback(
    product => {
      const newSelectedProducts = selectedProducts.filter(
        selectedProduct => selectedProduct !== product,
      );
      const otherProductsWithSameParent = getOtherProductsWithSameParent(
        stepProducts,
        product.productSlug,
        product.variantSlug,
      );

      const incompatibleProducts = getIncompatibleProducts(
        stepProducts,
        product,
      );

      const newDisabledProducts = disabledProducts
        .filter(el => !otherProductsWithSameParent.includes(el))
        .filter(el => !incompatibleProducts.includes(el));

      setSelectedProducts(newSelectedProducts);
      setDisabledProducts(newDisabledProducts);
    },
    [disabledProducts, selectedProducts, stepProducts],
  );

  const toggleProduct = useCallback(
    product => {
      setCurrentProduct(product);
      selectedProducts.includes(product)
        ? removeProduct(product)
        : addProduct(product);
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
          currentProduct={currentProduct}
          incompatibleCovers={incompatibleCovers}
          incompatibleFactoryOptions={incompatibleFactoryOptions}
          selectedFactoryOptions={selectedFactoryOptions}
          selectedProducts={selectedProducts}
          setDisabledProducts={setDisabledProducts}
          setProductToAdd={setProductToAdd}
          setSelectedFactoryOptions={setSelectedFactoryOptions}
          setShowModal={setShowModal}
        />
      ) : (
        <div className={styles.builder}>
          <Container className={styles.container}>
            <div className={styles.top} ref={topRef}>
              <Sidebar
                allLocations={allLocations}
                isMobile={isMobile}
                openSection={openSection}
                removeProduct={removeProduct}
                selectedProducts={selectedProducts}
                setOpenSection={setOpenSection}
              />
              <StoreList
                className={styles.results}
                items={filteredLocations}
                onSelect={item => {
                  setSelectedStore(item);
                }}
                show={isInlineResultListVisible}
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
                  factoryOptions={factoryOptions}
                  makes={makes}
                />
              )}
            </div>
            {stepNumber > 0 && stepProducts.length > 0 && (
              <ProductsCarousel
                disabledProducts={disabledProducts}
                isMobile={isMobile}
                products={stepProducts}
                selectedCover={selectedCover}
                selectedProducts={selectedProducts}
                stepNumber={stepNumber}
                stepTitle={stepTitle}
                toggleGroup={toggleGroup}
                toggleProduct={toggleProduct}
              />
            )}
          </Container>
        </div>
      )}
    </>
  );
}
