'use client';

import { useState, useCallback, useEffect, useContext } from 'react';
import clsx from 'clsx';
import Button from '@components/button/button';
import SearchControls from './search-controls';
import StoreLocatorContext from '@contexts/store-locator';
import ResultsStoreTile from '@components/store-tile/result-store-tile';
import { getIcon } from '@lib/icons';
import { formatPrice } from '@lib/helpers';
import styles from './sidebar.module.scss';

const ExpandIcon = getIcon('expand-more-neutral');
const ListIcon = getIcon('list');
const CancelIcon = getIcon('cancel');
const CarIcon = getIcon('car');

const DEFAULT_PRICE_SUMMARY = {
  price: 0,
  installationCost: 0,
};

const Section = ({
  id,
  headerChildren,
  headerClick,
  isOpen = false,
  children,
}) => {
  return (
    <div
      className={clsx(styles.section, {
        [styles.isOpen]: isOpen,
      })}
    >
      <button
        className={styles.sectionHeader}
        type="button"
        onClick={() => headerClick(id)}
      >
        {headerChildren}
        <ExpandIcon className={styles.sectionHeaderIcon} />
      </button>
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
};

const ProductsList = ({ selectedProducts, removeProduct }) => {
  return (
    <>
      {selectedProducts.length !== 0 ? (
        <ol className={styles.productsList}>
          {selectedProducts?.map(selectedProduct => {
            const productTitle = selectedProduct.variantName;
            const productPrice = selectedProduct.price;
            const productSlug = selectedProduct.variantSlug;

            return (
              <li className={styles.productsListItem} key={productSlug}>
                <div className={styles.productBox}>
                  {formatPrice(productPrice)}
                  <span className={styles.productBoxName}>{productTitle}</span>
                </div>
                <Button
                  className={styles.productRemove}
                  variant="quaternary"
                  onClick={() => removeProduct(selectedProduct)}
                >
                  <CancelIcon />
                </Button>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className={styles.noProducts}>
          Select products from the bottom of the screen to create a quote.
          <div className={clsx(styles.productBox, styles.isEmpty)}>
            No products added yet
          </div>
        </div>
      )}
    </>
  );
};

const NrCircle = ({ nr, isSmall, className }) => {
  if (nr === 0) return null;

  return (
    <div
      className={clsx(styles.nr, {
        [styles.isSmall]: isSmall,
      })}
    >
      {nr}
    </div>
  );
};

export default function Sidebar({
  selectedProducts,
  removeProduct,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState('store');
  const [priceSummary, setPriceSummary] = useState(DEFAULT_PRICE_SUMMARY);

  const { selectedStore } = useContext(StoreLocatorContext);

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  useEffect(
    function calculatePrice() {
      let newPriceSummary = selectedProducts.reduce(
        (accumulator, currentProduct) => ({
          price: accumulator.price + currentProduct.price,
          installationCost:
            accumulator.installationCost + currentProduct.installationCost,
        }),
        DEFAULT_PRICE_SUMMARY,
      );

      setPriceSummary(newPriceSummary);
    },
    [selectedProducts],
  );

  return (
    <>
      <div
        className={clsx(styles.sidebar, className, {
          [styles.isOpen]: isOpen,
        })}
      >
        <Section
          id="products"
          headerChildren={
            <>
              Your setup <NrCircle nr={selectedProducts.length} />
            </>
          }
          headerClick={setOpenSection}
          isOpen={openSection === 'products'}
        >
          <ProductsList
            selectedProducts={selectedProducts}
            removeProduct={removeProduct}
          />
        </Section>
        <Section
          id="store"
          headerChildren={<>Locate your store</>}
          headerClick={setOpenSection}
          isOpen={openSection === 'store'}
        >
          <SearchControls />
          {selectedStore && <ResultsStoreTile item={selectedStore} />}
        </Section>
        <div className={styles.summary}>
          <button
            className={styles.mobileSidebarToggle}
            onClick={toggleOpen}
            type="button"
          >
            <CarIcon />
          </button>
          <div className={styles.summaryPrice}>
            {formatPrice(priceSummary.price)}
          </div>
          <div className={styles.summaryInstallation}>
            +{' '}
            {priceSummary.installationCost === 0 ? (
              <>
                installation <span className={styles.isDesktop}>cost</span>
              </>
            ) : (
              formatPrice(priceSummary.installationCost)
            )}
          </div>
          <Button
            className={styles.summaryButton}
            size="large"
            disabled={selectedProducts.length === 0 || !selectedStore}
          >
            Send enquiry
          </Button>
        </div>
      </div>
      <div className={styles.sidebarMobileBar}>
        <button
          className={styles.mobileSidebarToggle}
          onClick={toggleOpen}
          type="button"
        >
          <ListIcon />
          <NrCircle nr={selectedProducts.length} isSmall />
        </button>
        <div className={styles.sidebarMobileBarPrice}>
          {formatPrice(priceSummary.price)}
        </div>
        <Button
          size="large"
          disabled={selectedProducts.length === 0 || !selectedStore}
        >
          Send enquiry
        </Button>
      </div>
    </>
  );
}
