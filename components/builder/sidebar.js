'use client';

import { useCallback, useContext, useEffect, useState } from 'react';

import clsx from 'clsx';

import StoreLocatorContext from '@contexts/store-locator';
import { useVehicleContext } from '@contexts/vehicle';

import { formatPrice } from '@lib/helpers';
import { getIcon } from '@lib/icons';
import normalizeStores from '@lib/normalize-stores';

import Button from '@components/button/button';
import EnquiryModal from '@components/enquiry-form/enquiry-modal';
import StoreList from '@components/store-list/store-list';

import ProductsList from './sidebar-products-list';
import styles from './sidebar.module.scss';

const ExpandIcon = getIcon('expand-more-neutral');
const CartIcon = getIcon('cart');
const CarIcon = getIcon('car');

const DEFAULT_PRICE_SUMMARY = {
  freight: 0,
  installationCost: 0,
  price: 0,
};

const Section = ({
  children,
  headerChildren,
  headerClick,
  icon,
  id,
  isOpen = false,
}) => {
  const Icon = getIcon(icon);

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
        <span className={styles.sectionHeaderInner}>
          {headerChildren}

          {icon && <Icon />}
        </span>

        <ExpandIcon className={styles.sectionHeaderIcon} />
      </button>
      <div className={clsx(styles.sectionContent, 'p-small')}>{children}</div>
    </div>
  );
};

export default function Sidebar({
  allLocations,
  className,
  globalOptions,
  isMobile,
  openSection,
  removeProduct,
  selectedProducts,
  setOpenSection,
  stepNumber,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceSummary, setPriceSummary] = useState(DEFAULT_PRICE_SUMMARY);
  const [enquiryModalOpened, setEnquiryModalOpened] = useState(false);
  const [normalizedLocations, setNormalizedLocations] = useState([]);

  const {
    filteredLocations,
    filteredStores,
    hasMapInteracted,
    isMapVisible,
    location,
    productsSectionOpen,
    searchGeolocation,
    selectedStore,
    setFilteredStores,
    setProductsSectionOpen,
    setSelectedStore,
    setShowLocationError,
    showLocationError,
  } = useContext(StoreLocatorContext);

  const isInlineResultListVisible = Boolean(location && searchGeolocation);
  const isInlineMapVisible = Boolean(isMobile && isMapVisible);

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleButtonWrapperClick = () => {
    if (!selectedStore) {
      setShowLocationError(true);
      setOpenSection('store');
      if (isMobile) {
        setIsOpen(true);
      } else {
        toggleOpen();
      }
    }
  };

  const handleOpenModal = () => {
    setEnquiryModalOpened(true);
  };

  const handleCloseModal = () => {
    setEnquiryModalOpened(false);
  };

  useEffect(() => {
    if (productsSectionOpen) {
      setOpenSection('products');
      setProductsSectionOpen(false);
    }
  }, [productsSectionOpen, setOpenSection, setProductsSectionOpen]);

  const { selectedCover } = useVehicleContext();

  useEffect(
    function calculatePrice() {
      // Check if the selectedCover is already included in selectedProducts
      const isCoverIncluded = selectedProducts.some(
        product => product.productSlug === selectedCover?.productSlug,
      );

      // Only add selectedCover if it's not already included
      const allProducts = isCoverIncluded
        ? selectedProducts
        : selectedCover
          ? [selectedCover, ...selectedProducts]
          : selectedProducts;

      let newPriceSummary = allProducts.reduce(
        (accumulator, currentProduct) => {
          const newAccumulator = {
            freight: accumulator.freight + (currentProduct.freight || 0),
            installationCost:
              accumulator.installationCost +
              (currentProduct.installationCost || 0),
            price: accumulator.price + (currentProduct.price || 0),
          };

          return newAccumulator;
        },
        DEFAULT_PRICE_SUMMARY,
      );

      setPriceSummary(newPriceSummary);
    },
    [selectedCover, selectedProducts],
  );

  useEffect(
    function normalizeStoreLocations() {
      const normalized = normalizeStores(allLocations);
      setNormalizedLocations(normalized);
    },
    [allLocations],
  );

  return (
    <>
      <div
        className={clsx(styles.sidebar, className, {
          [styles.isOpen]: isOpen,
          [styles.isDisabled]: stepNumber === 0,
        })}
      >
        <h4>Your Setup</h4>
        <ProductsList
          removeProduct={removeProduct}
          selectedProducts={selectedProducts}
        />
        <div className={styles.summary}>
          <button
            className={styles.mobileSidebarToggle}
            onClick={toggleOpen}
            type="button"
          >
            <CarIcon />
          </button>
          <div className={clsx(styles.summaryPrice, 'h4')}>
            {formatPrice(priceSummary.price)}
          </div>
          <div className={clsx(styles.summaryInstallation, 'p-small')}>
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
          <div
            className={styles.summaryButtonWrapper}
            onClick={handleButtonWrapperClick}
          >
            <Button
              className={styles.summaryButton}
              disabled={selectedProducts.length === 0}
              onClick={handleOpenModal}
              size="large"
            >
              Add to Cart
            </Button>
            <Button
              className={styles.summaryButton}
              disabled={selectedProducts.length === 0}
              onClick={handleOpenModal}
              size="large"
              variant="secondary"
            >
              Make Enquiry
            </Button>
          </div>
        </div>
      </div>
      <div
        className={clsx(styles.sidebarMobileBar, {
          [styles.isHidden]: stepNumber === 0,
        })}
      >
        <button
          className={styles.mobileSidebarToggle}
          onClick={toggleOpen}
          type="button"
        >
          <CartIcon />
          {selectedProducts.length > 0 && (
            <div className={styles.productCounter}>
              {selectedProducts.length}
            </div>
          )}
        </button>
        <div
          className={styles.sidebarMobileBarSummary}
          onClick={handleButtonWrapperClick}
        >
          <div className={styles.sidebarMobileBarPrice}>
            {formatPrice(priceSummary.price)}
          </div>
          <Button
            disabled={selectedProducts.length === 0}
            onClick={handleOpenModal}
            size="large"
            variant="secondary"
          >
            Make Enquiry
          </Button>
          <Button
            disabled={selectedProducts.length === 0}
            onClick={handleOpenModal}
            size="large"
          >
            Add to Cart
          </Button>
        </div>
      </div>
      {enquiryModalOpened && (
        <EnquiryModal
          allLocations={allLocations}
          enquiryFormId={globalOptions?.enquiryFormId}
          freight={priceSummary.freight}
          installationCost={priceSummary.installationCost}
          onClose={handleCloseModal}
          productPrice={priceSummary.price}
          selectedProducts={selectedProducts}
          showStoreSearchcontrols={true}
          store={selectedStore}
        />
      )}
      {isInlineResultListVisible && !selectedStore && !isMapVisible && (
        <div
          className={clsx({
            [styles.list]: isInlineResultListVisible,
            [styles.isHidden]: stepNumber === 0,
          })}
        >
          <StoreList
            allLocations={allLocations}
            hasMapInteracted={hasMapInteracted}
            items={hasMapInteracted ? filteredStores : filteredLocations}
            onSelect={item => {
              setSelectedStore(item);
            }}
            paddingRight="16px"
            show={isInlineResultListVisible}
            wideLayout={true}
          />
        </div>
      )}
    </>
  );
}
