'use client';

import { useCallback, useContext, useEffect, useState } from 'react';

import clsx from 'clsx';

import StoreLocatorContext from '@contexts/store-locator';

import { formatPrice } from '@lib/helpers';
import { getIcon } from '@lib/icons';

import Button from '@components/button/button';
import EnquiryModal from '@components/enquiry-form/enquiry-modal';
import StoreList from '@components/store-list/store-list';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import StoreSearchControls from '@components/store-search-controls/store-search-controls';
import ResultsStoreTile from '@components/store-tile/result-store-tile';

import ProductsList from './sidebar-products-list';
import styles from './sidebar.module.scss';

const ExpandIcon = getIcon('expand-more-neutral');
const ListIcon = getIcon('list');

const DEFAULT_PRICE_SUMMARY = {
  installationCost: 0,
  price: 0,
};

const Section = ({
  children,
  headerChildren,
  headerClick,
  id,
  isOpen = false,
}) => {
  return (
    <div
      className={clsx(styles.section, {
        [styles.isOpen]: isOpen,
      })}
    >
      <button
        className={styles.sectionHeader}
        onClick={() => headerClick(id)}
        type="button"
      >
        {headerChildren}
        <ExpandIcon className={styles.sectionHeaderIcon} />
      </button>
      <div className={styles.sectionContent}>{children}</div>
    </div>
  );
};

const NrCircle = ({ className, isSmall, nr }) => {
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
  allLocations,
  className,
  isMobile,
  openSection,
  removeProduct,
  selectedProducts,
  setOpenSection,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceSummary, setPriceSummary] = useState(DEFAULT_PRICE_SUMMARY);
  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);

  const {
    filteredLocations,
    isMapVisible,
    location,
    radius,
    searchGeolocation,
    selectedStore,
    setSelectedStore,
  } = useContext(StoreLocatorContext);

  const isInlineResultListVisible = Boolean(
    location && searchGeolocation && radius,
  );
  const isInlineMapVisible = Boolean(isMobile && isMapVisible);

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleOpenModal = () => {
    setEnquiryModalOpened(true);
  };

  const handleCloseModal = () => {
    setEnquiryModalOpened(false);
  };

  useEffect(
    function calculatePrice() {
      let newPriceSummary = selectedProducts.reduce(
        (accumulator, currentProduct) => ({
          installationCost:
            accumulator.installationCost + currentProduct.installationCost,
          price: accumulator.price + currentProduct.price,
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
          headerChildren={
            <>
              Your setup <NrCircle nr={selectedProducts.length} />
            </>
          }
          headerClick={setOpenSection}
          id="products"
          isOpen={openSection === 'products'}
        >
          <ProductsList
            removeProduct={removeProduct}
            selectedProducts={selectedProducts}
          />
        </Section>
        <Section
          headerChildren={<>Locate your store</>}
          headerClick={setOpenSection}
          id="store"
          isOpen={openSection === 'store'}
        >
          <StoreSearchControls
            allLocations={allLocations}
            isHidden={selectedStore}
            label={null}
          />
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
                onSelect={item => {
                  setSelectedStore(item);
                }}
                show={isInlineResultListVisible}
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
            disabled={selectedProducts.length === 0 || !selectedStore}
            onClick={handleOpenModal}
            size="large"
          >
            Send enquiry
          </Button>
        </div>
      </div>
      <div
        className={clsx(styles.sidebarMobileBar, {
          [styles.isHidden]: selectedProducts.length === 0,
        })}
      >
        <button
          className={styles.mobileSidebarToggle}
          onClick={toggleOpen}
          type="button"
        >
          <ListIcon />
          <NrCircle isSmall nr={selectedProducts.length} />
        </button>
        <div className={styles.sidebarMobileBarPrice}>
          {formatPrice(priceSummary.price)}
        </div>
        <Button
          disabled={selectedProducts.length === 0 || !selectedStore}
          onClick={handleOpenModal}
          size="large"
        >
          Send enquiry
        </Button>
      </div>
      {enquiryModalOpened && (
        <EnquiryModal
          installationCost={priceSummary.installationCost}
          onClose={handleCloseModal}
          productPrice={priceSummary.price}
          selectedProducts={selectedProducts}
          store={selectedStore}
        />
      )}
    </>
  );
}
