'use client';

import { useState, useCallback, useEffect, useContext } from 'react';
import clsx from 'clsx';
import Button from '@components/button/button';
import StoreSearchControls from '@components/store-search-controls/store-search-controls';
import StoreLocatorContext from '@contexts/store-locator';
import ResultsStoreTile from '@components/store-tile/result-store-tile';
import StoreList from '@components/store-list/store-list';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import ProductsList from './sidebar-products-list';

import { getIcon } from '@lib/icons';
import { formatPrice } from '@lib/helpers';
import styles from './sidebar.module.scss';

const ExpandIcon = getIcon('expand-more-neutral');
const ListIcon = getIcon('list');

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

const NrCircle = ({ nr, isSmall, className }) => {
  if (nr === 0) return null;

  return (
    <div
      className={clsx(styles.nr, className, {
        [styles.isSmall]: isSmall,
      })}
    >
      {nr}
    </div>
  );
};

export default function Sidebar({
  openSection,
  setOpenSection,
  selectedProducts,
  removeProduct,
  isMobile,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceSummary, setPriceSummary] = useState(DEFAULT_PRICE_SUMMARY);

  const {
    searchGeolocation,
    location,
    selectedStore,
    setSelectedStore,
    filteredLocations,
    isMapVisible,
    radius,
  } = useContext(StoreLocatorContext);

  const isInlineResultListVisible = Boolean(
    location && searchGeolocation && radius,
  );
  const isInlineMapVisible = Boolean(isMobile && isMapVisible);

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
          <StoreSearchControls isHidden={selectedStore} />
          {selectedStore ? (
            <ResultsStoreTile item={selectedStore} />
          ) : (
            <>
              {isInlineMapVisible && (
                <StoreLocatorMap
                  className={styles.map}
                  locations={filteredLocations}
                  onMarkerClick={setSelectedStore}
                />
              )}
              <StoreList
                className={styles.results}
                items={filteredLocations}
                show={isInlineResultListVisible}
                onSelect={item => {
                  setSelectedStore(item);
                }}
              />
            </>
          )}
        </Section>
        <div className={styles.summary}>
          <button
            className={styles.mobileSidebarToggle}
            onClick={toggleOpen}
            type="button"
          >
            <ListIcon />
            <NrCircle nr={selectedProducts.length} />
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
              <>
                {formatPrice(priceSummary.installationCost)}
                <span className={styles.isDesktop}> for installation</span>
              </>
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
