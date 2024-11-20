import { useCallback, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

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
  freight,
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

  const handleSubmitClick = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
      setIsFormDirty(true);
    }
  };

  const onLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const onSubmit = useCallback(formData => {
    setFormIsSending(true);

    console.group('Form Submission Data');
    console.log('Raw Form Data:', formData);
    console.log('Form Fields:', formData?.formFields?.nodes);
    console.groupEnd();
  }, []);

  const onSuccess = useCallback(formData => {
    setFormIsSending(false);
    setFormIsSent(true);

    // Debug log on success
    console.group('Form Success Data');
    console.log('Raw Form Data:', formData);
    console.log('Form Fields:', formData?.formFields?.nodes);
    console.groupEnd();

    const formFields = formData?.formFields?.nodes || [];
    const getUserField = type =>
      formFields.find(field => field.type === type)?.value;

    const nameField = getUserField('NAME');
    const addressField = getUserField('ADDRESS');

    const userData = {
      city: addressField?.city,
      country: addressField?.country || 'AU',
      email: getUserField('EMAIL'),
      first_name: nameField?.firstName,
      last_name: nameField?.lastName,
      phone_number: getUserField('PHONE'),
      postal_code: addressField?.postalCode,
      street: addressField?.streetAddress,
    };

    console.log('Setting user data:', userData);
    window.gtag('set', 'user_data', userData);

    // Verify gtag exists
    console.log('GTM loaded:', !!window.gtag);
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

              {!formIsSent && (
                <div className={styles.enquirySummary}>
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
                  <div className={styles.label}>
                    Total cost:
                    <Tooltip
                      attributes={{
                        content: `Removal of existing, non compatible products may incur additional costs. Please check the <a href="${routes.privacyAndTerms}">terms and conditions</a> for more information.`,
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
