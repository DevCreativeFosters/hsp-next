import { useCallback, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { useVehicleContext } from '@contexts/vehicle';

import { formatPrice } from '@lib/helpers';
import { getIcon } from '@lib/icons';
import routes from '@lib/routes';

import Button from '@components/button/button';
import GravityFormWrapper from '@components/gravity-forms/gravity-form-wrapper';
import Loading from '@components/loading/loading';
import StoreTile from '@components/store-tile/store-tile';
import Tooltip from '@components/tooltip/tooltip';

import DecorationImage from '@assets/images/bg-offroad.webp';

import styles from './enquiry-modal.module.scss';
import EnquiryProduct from './enquiry-product';

const InfoIcon = getIcon('info');

export default function EnquiryModal({
  enquiryFormId,
  installationCost,
  onClose,
  productPrice,
  selectedProducts,
  store,
}) {
  const [isLoading, setLoading] = useState(true);
  const [formIsSending, setFormIsSending] = useState(false);
  const [formIsSent, setFormIsSent] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const formRef = useRef();

  const { selectedFactoryOption } = useVehicleContext();
  const products = selectedProducts
    ?.map(
      ({ productName, sku, variantName }) =>
        `${productName}: ${variantName} (SKU: ${sku})`,
    )
    .join(', ');

  const factoryOptions =
    selectedFactoryOption?.title || 'No factory option selected';

  const allSelectedProducts = `Product: ${products} ::: Factory Option: ${factoryOptions}`;

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
            <h3 className={styles.title}>
              {formIsSent ? 'Enquiry sent!' : 'Send enquiry'}
            </h3>
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
              })}
            >
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
                          value: store?.storeId || store?.name || 'Not set',
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

              {!formIsSent && (
                <div className={styles.enquirySummary}>
                  <div className={styles.label}>Products of interest:</div>
                  <div className={styles.products}>
                    {selectedProducts?.map(
                      ({
                        installationCost: itemInstallationCost,
                        price: itemPrice,
                        productName,
                        sku,
                        uteBuilderImages,
                        variantSlug: productSlug,
                      }) => {
                        const productImage =
                          uteBuilderImages?.imageDesktop?.node?.sourceUrl;
                        let name = `${productName}`;

                        const price = itemPrice || productPrice;
                        const installCost =
                          itemInstallationCost || installationCost;

                        return (
                          <EnquiryProduct
                            imageUrl={productImage}
                            installationCost={installCost}
                            key={productSlug}
                            name={name}
                            price={price}
                            sku={sku}
                          />
                        );
                      },
                    )}
                  </div>
                  <div className={styles.label}>
                    Total cost:
                    <Tooltip
                      attributes={{
                        content: `Installation costs may vary. For a complete breakdown, please refer to our <a href="${routes.privacyAndTerms}">Terms & Conditions.</a>`,
                        title: '*Installation cost may vary',
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
                          <td>$0</td>
                        </tr>
                        <tr className={styles.total}>
                          <td>Total</td>
                          <td>
                            {formatPrice(productPrice + installationCost)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.label}>Your local store:</div>
                  <StoreTile item={store} />
                </div>
              )}
            </div>
          </div>
          {!formIsSent && (
            <div className={styles.footer}>
              <div className={styles.footerInfo}>
                <InfoIcon />
                <div>
                  By submitting the form you agree to our{' '}
                  <Link href={routes.privacyAndTerms}>Terms & Conditions.</Link>
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
