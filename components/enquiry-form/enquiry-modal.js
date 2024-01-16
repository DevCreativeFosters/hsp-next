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
                        ?.map(({ variantName }) => variantName)
                        .join(','), // TODO: Maybe product IDs? Depends on needs
                    },
                  ]}
                />
              </div>

              {!formIsSent && (
                <div className={styles.enquirySummary}>
                  <div className={styles.label}>Products of interest:</div>
                  <div className={styles.products}>
                    {selectedProducts?.map(
                      ({
                        variantName: productName,
                        variantSlug: productSlug,
                        uteBuilderImages,
                      }) => {
                        const productImage =
                          uteBuilderImages?.imageDesktop?.sourceUrl;

                        return (
                          <EnquiryProduct
                            name={productName}
                            imageUrl={productImage}
                            price={productPrice}
                            installationCost={installationCost}
                            key={productSlug}
                          />
                        );
                      },
                    )}
                  </div>
                  <div className={styles.label}>
                    Total cost:
                    <Tooltip
                      attributes={{
                        title: '*Installation cost may vary',
                        content: `Installation costs may vary. For a complete breakdown, please refer to our <a href="${routes.privacyAndTerms}">Terms & Conditions.</a>`,
                      }}
                    />
                  </div>
                  <div className={styles.priceSummaryWrapper}>
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

            {!formIsSent && (
              <div className={styles.footer}>
                <div className={styles.footerInfo}>
                  <InfoIcon />
                  <div>
                    By submitting the form you agree to our{' '}
                    <Link href={routes.privacyAndTerms}>
                      Terms & Conditions.
                    </Link>
                  </div>
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
      </div>
    </div>
  );
}
