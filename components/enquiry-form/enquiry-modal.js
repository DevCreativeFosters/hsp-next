import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Button from '@components/button/button';
import Tooltip from '@components/tooltip/tooltip';
import StoreTile from '@components/store-tile/store-tile';
import GravityForm from '@components/gravity-forms/gravity-form-provider';
import Loading from '@components/loading/loading';
import EnquiryProduct from './enquiry-product';
import { getIcon } from '@lib/icons';
import { formatPrice } from '@lib/helpers';
import routes from '@lib/routes';
import styles from './enquiry-modal.module.scss';

const InfoIcon = getIcon('info');

export default function EnquiryModal({
  enquiryFormId,
  onClose,
  store,
  selectedProducts,
  productPrice,
  installationCost,
}) {
  const [isLoading, setLoading] = useState(true);
  const [formIsSending, setFormIsSending] = useState(false);
  const [formIsSent, setFormIsSent] = useState(false);
  const formRef = useRef();

  const handleSubmitClick = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
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
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.enquiryModal}>
        <div className={styles.enquiryContent}>
          {isLoading && (
            <div className={styles.enquiryLoader}>
              <Loading color="white" size="large" />
            </div>
          )}
          <div className={styles.header}>
            <Button
              rightIcon="arrow-backward-large"
              onClick={onClose}
              variant="tertiary"
              className={styles.backwardButton}
            />
            <h3 className={styles.title}>
              {formIsSent ? 'Enquiry sent!' : 'Send enquiry'}
            </h3>
            <Button
              rightIcon="close-large"
              onClick={onClose}
              variant="tertiary"
              className={styles.closeButton}
            />
          </div>
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
              <GravityForm
                ref={formRef}
                attributes={{ id: enquiryFormId }}
                onLoad={onLoad}
                onSubmit={onSubmit}
                onSuccess={onSuccess}
                onError={onError}
                onReset={onReset}
                submitButton={false}
                hiddenInputs={[
                  {
                    inputName: 'storeId',
                    value: store?.name, // TODO: It has to be updated to store ID once the stores are imported into WordPress.
                  },
                  {
                    inputName: 'products',
                    value: selectedProducts
                      ?.map(selectedProduct => selectedProduct.variantName)
                      .join(','), // TODO: Maybe product IDs? Depends on needs
                  },
                ]}
              />
            </div>
            {!formIsSent && (
              <div className={styles.enquirySummary}>
                <label className={styles.label}>Products of interest:</label>
                <div className={styles.products}>
                  {selectedProducts?.map(selectedProduct => {
                    const productTitle = selectedProduct?.variantName;
                    const productSlug = selectedProduct?.variantSlug;
                    const productImage =
                      selectedProduct?.uteBuilderImages?.imageDesktop
                        ?.sourceUrl;

                    return (
                      <EnquiryProduct
                        name={productTitle}
                        imageUrl={productImage}
                        price={productPrice}
                        installationCost={installationCost}
                        key={productSlug}
                      />
                    );
                  })}
                </div>
                <label className={styles.label}>
                  Total cost:
                  <Tooltip
                    attributes={{
                      title: '*Installation cost may vary',
                      content:
                        'Installation costs may vary. For a complete breakdown, please refer to our <a href="/privacy-terms-and-conditions/">Terms & Conditions.</a>',
                    }}
                  />
                </label>
                <table className={styles.priceSummary}>
                  <tbody>
                    <tr>
                      <td>Products</td>
                      <td>{formatPrice(productPrice)} </td>
                    </tr>
                    <tr>
                      <td>Installation*</td>
                      <td>{formatPrice(installationCost)}</td>
                    </tr>
                    <tr>
                      <td>Freight</td>
                      <td>$0</td>
                    </tr>
                    <tr className={styles.isSummary}>
                      <td>Total</td>
                      <td>{formatPrice(productPrice + installationCost)}</td>
                    </tr>
                  </tbody>
                </table>
                <label className={styles.label}>Your local store:</label>
                <StoreTile item={store} />
              </div>
            )}
          </div>
          {!formIsSent && (
            <div className={styles.footer}>
              <div className={styles.footerInfo}>
                <InfoIcon />
                By submitting the form you agree to our{' '}
                <Link href={routes.privacyAndTerms}>Terms & Conditions.</Link>
              </div>
              <Button
                type="submit"
                rightIcon={formIsSending ? '' : 'send'}
                size="large"
                onClick={handleSubmitClick}
                className={styles.footerButton}
                disabled={formIsSending}
              >
                Submit {formIsSending && <Loading />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
