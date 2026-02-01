import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import StoreLocatorContext from '@contexts/store-locator';

import { formatPrice } from '@lib/helpers';
import { getIcon } from '@lib/icons';
import normalizeStores from '@lib/normalize-stores';
import routes from '@lib/routes';

import Button from '@components/button/button';
import GravityFormWrapper from '@components/gravity-forms/gravity-form-wrapper';
import Loading from '@components/loading/loading';
import StoreList from '@components/store-list/store-list';
import StoreLocatorMap from '@components/store-locator-map/store-locator-map';
import StoreSearchControls from '@components/store-search-controls/store-search-controls';
import ResultsStoreTile from '@components/store-tile/result-store-tile';
import Tooltip from '@components/tooltip/tooltip';

import DecorationImage from '@assets/images/bg-offroad.png';

import styles from './enquiry-modal.module.scss';
import EnquiryProduct from './enquiry-product';

const InfoIcon = getIcon('info');

export default function EnquiryModal({
  allLocations,
  enquiryForm = true,
  enquiryFormId,
  freight,
  installationCost,
  onClose,
  productPrice,
  selectedProducts,
  showSelectedProducts = true,
  showStoreSearchcontrols = false,
  showTotalCost = true,
  store,
  swapContainers = false,
}) {
  const [isLoading, setLoading] = useState(true);
  const [isEnquiryForm, setIsEnquiryForm] = useState(enquiryForm);
  const [formIsSending, setFormIsSending] = useState(false);
  const [formIsSent, setFormIsSent] = useState(false);
  const [showMoreResults, setShowMoreResults] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [normalizedLocations, setNormalizedLocations] = useState([]);
  const formRef = useRef();
  const installCost = installationCost;
  const freightCost = freight;

  const handleValue = (value, secondaryValue, defaultValue = 0) => {
    return value === null || value === undefined || value === ''
      ? secondaryValue === null ||
        secondaryValue === undefined ||
        secondaryValue === ''
        ? defaultValue
        : secondaryValue
      : value;
  };

  const {
    filteredLocations,
    filteredStores,
    hasMapInteracted,
    isMapVisible,
    location,
    searchGeolocation,
    selectedStore,
    setSelectedStore,
  } = useContext(StoreLocatorContext);

  const products = selectedProducts
    ?.map(
      ({ freight, installationCost, price, productName, sku }) =>
        `SKU#${handleValue(sku)},${handleValue(productName)},PRICE${handleValue(
          price,
          productPrice,
        )},FITTING${handleValue(
          installationCost,
          installCost,
        )},FREIGHT${handleValue(freight, freightCost)}`,
    )
    .join('|');

  const allSelectedProducts = products;
  const isInlineResultListVisible = Boolean(location && searchGeolocation);

  const interactWithDisabledForm = useCallback(() => {
    if (selectedStore) {
      setHighlight(Math.random());
    }
  }, [selectedStore]);
  useEffect(
    function normalizeStoreLocations() {
      if (showStoreSearchcontrols) {
        const normalized = normalizeStores(allLocations);
        setNormalizedLocations(normalized);
      }
    },
    [allLocations],
  );

  const handleSubmitClick = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
      setIsFormDirty(true);
    }
  };

  const onLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const onSubmit = useCallback(() => {
    setFormIsSending(true);
  }, []);

  const onSuccess = useCallback(() => {
    setFormIsSending(false);
    setFormIsSent(true);
  }, []);

  const onError = useCallback(() => {
    setFormIsSending(false);
  }, []);

  const onReset = useCallback(() => {
    setFormIsSending(false);
    setFormIsSent(false);
  }, []);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={clsx(styles.enquiryModal, { [styles.isSent]: formIsSent })}
        onClick={ev => ev.stopPropagation()}
      >
        {isLoading && (
          <div className={styles.enquiryLoader}>
            <Loading color="white" size="large" />
          </div>
        )}
        <div className={styles.enquiryContent}>
          <div className={styles.header}>
            <div className={styles.decorativeBackground}>
              <Image
                alt="Ford Raptor off-roading through the mud"
                height={406}
                src={DecorationImage.src}
                width={230}
              />
            </div>

            <Button
              className={styles.backwardButton}
              onClick={onClose}
              rightIcon="arrow-backward-large"
              variant="tertiary"
            />
            {isEnquiryForm ? (
              <h3 className={styles.title}>
                {formIsSent ? '' : 'Send enquiry'}
              </h3>
            ) : (
              <h3 className={styles.title}>
                {formIsSent ? '' : 'Product Availability Reminder'}
              </h3>
            )}
            <Button
              className={styles.closeButton}
              onClick={onClose}
              rightIcon="close-large"
              variant="tertiary"
            />
          </div>
          <div className={styles.scrollContainer}>
            <div
              className={clsx(styles.containers, {
                [styles.onSuccess]: formIsSent,
                [styles.swapContainers]: swapContainers,
              })}
            >
              {!formIsSent && (
                <div className={styles.enquirySummary}>
                  {showSelectedProducts && (
                    <>
                      <div className={styles.label}>Products of interest:</div>
                      <div className={styles.products}>
                        {selectedProducts?.map(
                          ({
                            image,
                            installationCost: itemInstallationCost,
                            price,
                            productName,
                            sku,
                            variantSlug: productSlug,
                          }) => {
                            const itemPrice =
                              price === false
                                ? 0
                                : price === null
                                  ? productPrice
                                  : price;
                            const installCost =
                              itemInstallationCost || installationCost;

                            return (
                              <EnquiryProduct
                                imageUrl={image}
                                installationCost={installCost}
                                key={productSlug}
                                name={productName}
                                price={itemPrice}
                                sku={sku}
                              />
                            );
                          },
                        )}
                      </div>
                    </>
                  )}
                  {isEnquiryForm && (
                    <>
                      {showTotalCost && (
                        <>
                          <div className={styles.label}>
                            Total cost:
                            <Tooltip
                              attributes={{
                                content: `Removal and/ or re-installation of existing or non-compatible products may incur additional costs. Please check the <a href="${routes.privacyAndTerms}">terms and conditions</a> for more information.`,
                                title: '*Installation Terms',
                              }}
                            />
                          </div>
                          <div className={styles.priceSummaryWrapper}>
                            <table className={styles.priceSummary}>
                              <tbody>
                                <tr>
                                  <td>Products</td>
                                  <td>{formatPrice(productPrice)}</td>
                                </tr>
                                <tr>
                                  <td>Installation*</td>
                                  <td>{formatPrice(installationCost)}</td>
                                </tr>
                                <tr>
                                  <td>Freight</td>
                                  <td>{formatPrice(freight) || '$0'}</td>
                                </tr>
                                <tr className={styles.total}>
                                  <td>Total</td>
                                  <td>
                                    {formatPrice(
                                      productPrice + installationCost + freight,
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}

                      {showStoreSearchcontrols && (
                        <StoreSearchControls
                          allLocations={allLocations}
                          interactWithDisabledForm={interactWithDisabledForm}
                          isWide
                        />
                      )}

                      {selectedStore ? (
                        <ResultsStoreTile
                          isHighlighted={highlight}
                          item={selectedStore}
                        />
                      ) : (
                        <>
                          {isMapVisible && (
                            <StoreLocatorMap
                              locations={normalizedLocations}
                              onMarkerClick={setSelectedStore}
                            />
                          )}

                          <StoreList
                            allLocations={allLocations}
                            className={styles.results}
                            hasMapInteracted={hasMapInteracted}
                            itemInList={true}
                            items={
                              hasMapInteracted
                                ? filteredStores
                                : filteredLocations
                            }
                            noRowGap={true}
                            onSelect={item => {
                              setSelectedStore(item);
                            }}
                            show={isInlineResultListVisible}
                            showCategory={true}
                            showDisplays={true}
                            showIndex={false}
                            showMoreResults={showMoreResults}
                          />
                          {!showMoreResults &&
                            isInlineResultListVisible &&
                            filteredStores.length > 5 && (
                              <div className={styles.showMoreWrapper}>
                                <Button
                                  className={styles.showMoreButton}
                                  onClick={() => setShowMoreResults(true)}
                                  size="small"
                                  variant="septenary"
                                >
                                  Load more results
                                </Button>
                              </div>
                            )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              <div
                className={clsx(styles.formContainer, {
                  [styles.onSuccess]: formIsSent,
                })}
              >
                <>
                  {enquiryFormId && (
                    <GravityFormWrapper
                      attributes={{ id: enquiryFormId }}
                      hiddenInputs={[
                        {
                          inputName: 'storeId',
                          value: store?.storeId || 'Not set',
                        },
                        {
                          inputName: 'storeName',
                          value: store?.name || 'Not set',
                        },
                        {
                          inputName: 'products',
                          value: allSelectedProducts,
                        },
                      ]}
                      isDirty={isFormDirty}
                      onError={onError}
                      onLoad={onLoad}
                      onReset={onReset}
                      onSubmit={onSubmit}
                      onSuccess={onSuccess}
                      ref={formRef}
                      submitButton={false}
                    />
                  )}
                </>
              </div>
            </div>
          </div>
          {!formIsSent && (
            <div className={styles.footer}>
              <div className={styles.footerInfo}>
                <InfoIcon />
                <div>
                  By submitting the form you agree to our{' '}
                  <Link href={routes.privacyAndTerms} target="_blank">
                    Terms & Conditions.
                  </Link>
                </div>
              </div>
              <Button
                className={styles.footerButton}
                disabled={formIsSending}
                onClick={handleSubmitClick}
                rightIcon={formIsSending ? '' : 'send'}
                size="large"
                type="submit"
              >
                Submit {formIsSending && <Loading />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
