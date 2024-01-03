import { useCallback, useState } from 'react';
import Link from 'next/link';

import Button from '@components/button/button';
import Tooltip from '@components/tooltip/tooltip';
import Form from '@components/form/form';
import Input from '@components/form/input';
import Radio from '@components/form/radio';
import Textarea from '@components/form/textarea';
import StoreTile from '@components/store-tile/store-tile';
import EnquiryProduct from './enquiry-product';
import { getIcon } from '@lib/icons';
import { formatPrice } from '@lib/helpers';
import styles from './enquiry-modal.module.scss';

const InfoIcon = getIcon('info');

const DEFAULT_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  message: '',
  delivery: '',
  dealershipEmail: '',
};

export default function EnquiryModal({
  onClose,
  store,
  selectedProducts,
  productPrice,
  installationCost,
}) {
  const [formData, setFormData] = useState(DEFAULT_VALUES);
  const [errors, setErrors] = useState(DEFAULT_VALUES);

  const validateForm = useCallback(() => {
    let newErrors = DEFAULT_VALUES;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    // TODO: ADD validate delivery

    if (
      formData.dealershipEmail &&
      !/\S+@\S+\.\S+/.test(formData.dealershipEmail)
    ) {
      newErrors.dealershipEmail = 'Dealership email is invalid';
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(
      errorMessage => errorMessage !== '',
    );

    return !hasErrors;
  }, [formData]);

  const handleFormChange = useCallback(
    ev => {
      setFormData({
        ...formData,
        [ev.target.name]: ev.target.value,
      });
    },
    [formData],
  );

  const handleFormSubmit = useCallback(
    ev => {
      ev.preventDefault();
      const isValid = validateForm();

      if (isValid) {
        //submit form
      }
    },
    [validateForm],
  );

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.enquiryModal}>
        <div className={styles.header}>
          <Button
            rightIcon="arrow-backward-large"
            onClick={onClose}
            variant="tertiary"
            className={styles.backwardButton}
          />
          <h3 className={styles.title}>Send enquiry</h3>
          <Button
            rightIcon="close-large"
            onClick={onClose}
            variant="tertiary"
            className={styles.closeButton}
          />
        </div>
        <div className={styles.containers}>
          <div className={styles.formContainer}>
            <Form onSubmit={handleFormSubmit}>
              <label className={styles.label}>Your details: </label>
              <Input
                label="First name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
                placeholder="First name"
                halfWidth
                required
                errorMessage={errors.firstName}
              />
              <Input
                label="Last name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
                placeholder="Last name"
                halfWidth
                required
                errorMessage={errors.lastName}
              />
              <Input
                label="E-mail"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="E-mail"
                halfWidth
                required
                errorMessage={errors.email}
              />
              <Input
                label="Phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="Phone"
                halfWidth
                required
                errorMessage={errors.phone}
              />
              <Input
                label="City"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                placeholder="City"
                required
                errorMessage={errors.city}
              />
              <Textarea
                label="Your message"
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder="Your message"
                required
                errorMessage={errors.message}
              />
              <Radio
                label="Choose an option:"
                name="delivery"
                options={[
                  { label: 'Pick-up from store', value: 'pick-up' },
                  { label: 'Get it installed', value: 'install' },
                ]}
                value={formData.delivery}
                onChange={handleFormChange}
                required
                errorMessage={errors.delivery}
              />
            </Form>
          </div>
          <div className={styles.enquirySummary}>
            <label className={styles.label}>Products of interest:</label>
            <div className={styles.products}>
              {selectedProducts?.map(selectedProduct => {
                const productTitle = selectedProduct?.variantName;
                const productPrice = selectedProduct?.price;
                const productInstallationCost =
                  selectedProduct?.installationCost;
                const productSlug = selectedProduct?.variantSlug;
                const productImage =
                  selectedProduct?.uteBuilderImages?.imageDesktop?.sourceUrl;

                return (
                  <EnquiryProduct
                    name={productTitle}
                    imageUrl={productImage}
                    price={productPrice}
                    installationCost={productInstallationCost}
                    key={productSlug}
                  />
                );
              })}
            </div>
            <label className={styles.label}>
              Total cost:
              <Tooltip
                title={'*Installation cost may vary'}
                content={
                  'Installation cost may vary. To read the whole breakdown please read our <a href="/privacy-terms-and-conditions/">Terms & Conditions.</a>'
                }
              />
            </label>
            <table className={styles.priceSummary}>
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
            </table>
            <label className={styles.label}>Your local store:</label>
            <StoreTile item={store} />
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            <InfoIcon />
            By submitting the form you agree to our{' '}
            <Link href="/privacy-terms-and-conditions/">
              Terms & Conditions.
            </Link>
          </div>
          <Button
            type="submit"
            rightIcon="send"
            size="large"
            onClick={handleFormSubmit}
            className={styles.footerButton}
            disabled={true}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}
