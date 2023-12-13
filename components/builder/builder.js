'use client';

import { useState, useCallback, useContext } from 'react';
import Container from '@components/container/container';
import ProductsCarousel from './products-carousel';
import Preview from './preview';
import Sidebar from './sidebar';
import StoreLocatorContext from '@contexts/store-locator';
import StoreList from '@components/store-list/store-list';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import { useIsMobile } from '@hooks/useIsMobile';

import styles from './builder.module.scss';

const getOtherProductsWithSameParent = (products, productSlug, variantSlug) =>
  products.filter(
    product =>
      product.productSlug === productSlug &&
      product.variantSlug !== variantSlug,
  );

const DEFAULT_OPEN_SECTION = 'products';

export default function Builder({ makeName, model, products }) {
  const [openSection, setOpenSection] = useState(DEFAULT_OPEN_SECTION);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [disabledProducts, setDisabledProducts] = useState([]);
  const isMobile = useIsMobile(1280);

  const {
    searchGeolocation,
    filteredLocations,
    selectedStore,
    setSelectedStore,
    isMapVisible,
    radius,
  } = useContext(StoreLocatorContext);

  const isInlineResultListVisible = Boolean(
    !selectedStore &&
      openSection === 'store' &&
      location &&
      searchGeolocation &&
      radius,
  );
  const isInlineMapVisible = Boolean(
    !selectedStore && openSection === 'store' && !isMobile && isMapVisible,
  );

  const addProduct = useCallback(
    product => {
      const newSelectedProducts = [...selectedProducts, product];
      const newDisabledProducts = [
        ...disabledProducts,
        ...getOtherProductsWithSameParent(
          products,
          product.productSlug,
          product.variantSlug,
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
        <div className={styles.top}>
          <Sidebar
            openSection={openSection}
            setOpenSection={setOpenSection}
            selectedProducts={selectedProducts}
            removeProduct={removeProduct}
            isMobile={isMobile}
          />

          <StoreList
            className={styles.results}
            items={filteredLocations}
            show={isInlineResultListVisible}
            onSelect={item => {
              setSelectedStore(item);
            }}
          />

          <Preview
            makeName={makeName}
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
        </div>
        <ProductsCarousel
          products={products}
          selectedProducts={selectedProducts}
          disabledProducts={disabledProducts}
          toggleProduct={toggleProduct}
        />
      </Container>
    </div>
  );
}
