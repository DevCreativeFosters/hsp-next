'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import StoreLocatorContext from '@contexts/store-locator';

import { useIsMobile } from '@hooks/useIsMobile';

import getRelatedCovers from '@lib/api/get-related-covers';
import normalizeUteBuilderProducts from '@lib/normalize-ute-builder-products';

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

export default function Builder({
  make,
  model,
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
  const [stepProducts, setStepProducts] = useState(products);
  const topRef = useRef(null);
  const isMobile = useIsMobile(1280);

  useEffect(() => {
    if (
      !make.slug ||
      !model.slug ||
      !globalOptions ||
      !globalOptions?.coversCategory
    ) {
      setStepProducts(products);

      return;
    }

    getRelatedCovers(
      make.slug,
      model.slug,
      globalOptions.coversCategory.nodes[0].slug,
    ).then(relatedCovers => {
      if (!relatedCovers) {
        setStepProducts(products);

        return;
      }

      const normalizedCovers = normalizeUteBuilderProducts(relatedCovers);

      setStepProducts([...normalizedCovers, ...noCover]);
    });
  }, [make, model, globalOptions, products, noCover]);

  const {
    location,
    searchGeolocation,
    filteredLocations,
    selectedStore,
    setSelectedStore,
    isMapVisible,
    radius,
  } = useContext(StoreLocatorContext);

  const isInlineResultListVisible = Boolean(
    openSection === 'store' && location && searchGeolocation && radius,
  );
  const isInlineMapVisible = Boolean(
    openSection === 'store' && !isMobile && isMapVisible,
  );

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
      const newSelectedProducts = [...selectedProducts, product];
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
    [selectedProducts, disabledProducts, products],
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
      selectedProducts.includes(product)
        ? removeProduct(product)
        : addProduct(product);
    },
    [selectedProducts, addProduct, removeProduct],
  );

  return (
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
          {make && model ? (
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
        {make && model && stepProducts.length > 0 && (
          <ProductsCarousel
            products={stepProducts}
            selectedProducts={selectedProducts}
            disabledProducts={disabledProducts}
            toggleProduct={toggleProduct}
          />
        )}
      </Container>
    </div>
  );
}
