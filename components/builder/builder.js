'use client';

import { useState, useCallback } from 'react';
import Container from '@components/container/container';
import ProductsCarousel from './products-carousel';
import Preview from './preview';
import Sidebar from './sidebar';

import styles from './builder.module.scss';

export default function Builder({ model, products }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [disabledProducts, setDisabledProducts] = useState([]);

  const addProduct = useCallback(
    product => {
      const newSelectedProducts = [...selectedProducts, product];

      setSelectedProducts(newSelectedProducts);
    },
    [selectedProducts],
  );

  const removeProduct = useCallback(
    product => {
      const newSelectedProducts = selectedProducts.filter(
        selectedProduct => selectedProduct !== product,
      );

      setSelectedProducts(newSelectedProducts);
    },
    [selectedProducts],
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
            selectedProducts={selectedProducts}
            removeProduct={removeProduct}
          />

          <Preview model={model} selectedProducts={selectedProducts} />
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
