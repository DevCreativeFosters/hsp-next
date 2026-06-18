'use client';

import { useEffect, useRef, useState } from 'react';

import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { clsx } from 'clsx';
import { State } from 'country-state-city';

import { useCart } from '@contexts/cart-context';
import { useUserContext } from '@contexts/user';

import Button from '@components/button/button';

import SearchIcon from '@assets/icons/search.svg';

import styles from './delivery.module.scss';

const libraries = ['places'];

function DeliveryAddressForm({
  allowDelivery,
  askCutomerInfo,
  formData,
  setFormData,
  setIsFormFilled,
}) {
  const { cartItems } = useCart();
  const { user } = useUserContext();
  // The commercial-address confirmation is only relevant when the cart
  // contains a freight-large item (Roll Cover, Armour Bar, Load Slides) —
  // those products can't go to residential addresses. For carts without
  // any large items the checkbox would be confusing noise, so we hide it
  // entirely and auto-accept so the validation still passes.
  const hasLargeItem = cartItems.some(item => item.largeItem);
  const showCommercialConfirmation = user?.role !== 'b2b' && hasLargeItem;
  const [acceptDeliveryTerms, setAcceptDeliveryTerms] = useState(false);

  useEffect(() => {
    // Auto-accept when (a) the user is B2B, or (b) there's no large item
    // in the cart and therefore no confirmation to ask for.
    if (user?.role === 'b2b' || !hasLargeItem) {
      setAcceptDeliveryTerms(true);
    } else {
      setAcceptDeliveryTerms(false);
    }
  }, [hasLargeItem, user?.role]);

  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace?.();
    if (!place || !place.address_components) return;

    const address = place.formatted_address || '';
    let city = '';
    let state = '';
    let postcode = '';

    place.address_components.forEach(component => {
      const types = component.types;
      if (types.includes('locality')) city = component.long_name;
      if (types.includes('administrative_area_level_1'))
        state = component.long_name;
      if (types.includes('postal_code')) postcode = component.long_name;
    });

    setFormData(prev => ({
      ...prev,
      address,
      city,
      postcode,
      state,
    }));
  };

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(prev => {
      const keys = name.split('.');
      const updated = { ...prev };
      let obj = updated;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          obj[key] = value; // final key assign
        } else {
          obj[key] = { ...obj[key] }; // clone before going deeper
          obj = obj[key]; // go deeper
        }
      });

      return updated;
    });
  };

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className={styles.deliveryForm}>
      {cartItems.some(item => item.largeItem) && !allowDelivery ? (
        <div className={styles.redBoxContent}>
          <h5>Commercial Address Required for Delivery</h5>
          <p>
            Some products — including the Electric Roll Cover, Armour Bar and
            Load Slides — can only be delivered to commercial or business
            addresses due to their size and handling requirements. Please update
            your delivery address to continue.
          </p>
        </div>
      ) : (
        <>
          {allowDelivery && cartItems.some(item => item.largeItem) && (
            <div className={clsx(styles.redBoxContent, styles.warning)}>
              <h5>Commercial Address Required for Delivery</h5>
              <p>
                Some products — including the Electric Roll Cover, Armour Bar
                and Load Slides — can only be delivered to commercial or
                business addresses due to their size and handling requirements.
                Please update your delivery address to continue.
              </p>
            </div>
          )}

          {askCutomerInfo && (
            <>
              <p className={styles.heading}>
                <strong>Customer Info:</strong>
              </p>
              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <input
                    name="additionalCustomerInfo.customer_first_name"
                    onChange={handleChange}
                    placeholder="First Name"
                    value={formData.additionalCustomerInfo?.customer_first_name}
                  />
                </div>
                <div className={styles.formCol}>
                  <input
                    name="additionalCustomerInfo.customer_last_name"
                    onChange={handleChange}
                    placeholder="Last Name"
                    value={formData.additionalCustomerInfo?.customer_last_name}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <input
                    name="additionalCustomerInfo.customer_email"
                    onChange={handleChange}
                    placeholder="Customer Email"
                    value={formData.additionalCustomerInfo?.customer_email}
                  />
                </div>
              </div>
              <p className={styles.heading}>
                <strong>Shipping Info:</strong>
              </p>
            </>
          )}

          {/* Country */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <div className={styles.lblSelect}>
                <span>Country/Region</span>
                <select
                  name="country"
                  onChange={handleChange}
                  value={formData.country}
                >
                  {/* {Country.getAllCountries().map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                  ))} */}
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </div>

          {!askCutomerInfo && (
            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <input
                  name="deliveryCompanyName"
                  onChange={handleChange}
                  placeholder="Company Name (Optional)"
                  value={formData.deliveryCompanyName}
                />
              </div>
            </div>
          )}

          {/* Address Autocomplete */}
          <Autocomplete
            onLoad={autocomplete => {
              autocompleteRef.current = autocomplete;
              autocomplete.setComponentRestrictions({
                country: formData.country.toLowerCase(),
              });

              // 👇 Move the dropdown inside your component for styling
              setTimeout(() => {
                const pacContainer = document.querySelector('.pac-container');
                pacContainer.classList.add('pacContainer');

                const formWrapper = document.querySelector(
                  `.${styles.autocomplete}`,
                );
                if (pacContainer && formWrapper) {
                  formWrapper.parentNode.insertBefore(
                    pacContainer,
                    formWrapper,
                  );
                }
              }, 500);
            }}
            onPlaceChanged={handlePlaceChanged}
          >
            <div className={styles.formRow}>
              <div className={clsx(styles.formCol, styles.autocomplete)}>
                <input
                  // name="address"
                  // onChange={handleChange}
                  placeholder="Address"
                  // value={formData.address}
                />
                <button className={styles.searchBtn} type="button">
                  <SearchIcon />
                </button>
              </div>
            </div>
          </Autocomplete>

          {/* Apartment */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <input
                name="address"
                onChange={handleChange}
                placeholder="Apartment, suite, etc."
                value={formData.address}
              />
            </div>
          </div>

          {/* City, State, postcode */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <input
                name="city"
                onChange={handleChange}
                placeholder="City"
                value={formData.city}
              />
            </div>
            <div className={styles.formCol}>
              <div className={styles.lblSelect}>
                <span>State/territory</span>
                <select
                  name="state"
                  onChange={handleChange}
                  value={formData.state}
                >
                  {State.getStatesOfCountry(formData.country).map(s => (
                    <option key={s.isoCode} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.formCol}>
              <input
                name="postcode"
                onChange={handleChange}
                placeholder="Postcode"
                value={formData.postcode}
              />
            </div>
          </div>
          {showCommercialConfirmation && (
            <div className={styles.formRow}>
              <div className={styles.inputFullCol}>
                <div className={styles.acceptCheckbox}>
                  <label>
                    <input
                      checked={acceptDeliveryTerms}
                      name="acceptDeliveryTerms"
                      onChange={e => setAcceptDeliveryTerms(e.target.checked)}
                      type="checkbox"
                    />
                    <span>
                      I confirm that my delivery address is a commercial
                      address, and I understand that any additional fees arising
                      from providing a residential address will be my
                      responsibility.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <Button
            className={styles.submitBtn}
            disabled={
              !formData.country ||
              !formData.address ||
              !formData.city ||
              !formData.state ||
              !formData.postcode ||
              !acceptDeliveryTerms
            }
            onClick={() => setIsFormFilled(true)}
            size="large"
          >
            Confirm Address
          </Button>

          {/* Billing-same-as-shipping toggle (Figma node 5443:36028).
              When unchecked we reveal a parallel billing address form;
              otherwise WP's checkoutOrder treats shipping as billing. */}
          <div className={styles.billingSameRow}>
            <label>
              <input
                checked={formData.billing_same_as_shipping !== false}
                name="billing_same_as_shipping"
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    billing_same_as_shipping: e.target.checked,
                  }))
                }
                type="checkbox"
              />
              <span>
                The billing address is the same as the address listed above.
              </span>
            </label>
          </div>

          {formData.billing_same_as_shipping === false && (
            <div className={styles.billingPanel}>
              <h3>Billing Address</h3>

              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <div className={styles.lblSelect}>
                    <span>Country/Region</span>
                    <select
                      name="billing_country"
                      onChange={handleChange}
                      value={formData.billing_country || 'AU'}
                    >
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <input
                    name="billing_company"
                    onChange={handleChange}
                    placeholder="Company Name (Optional)"
                    value={formData.billing_company || ''}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <input
                    name="billing_address"
                    onChange={handleChange}
                    placeholder="Address (We do not ship to PO Boxes)"
                    value={formData.billing_address || ''}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <input
                    name="billing_address_2"
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc. (Optional)"
                    value={formData.billing_address_2 || ''}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <input
                    name="billing_city"
                    onChange={handleChange}
                    placeholder="City"
                    value={formData.billing_city || ''}
                  />
                </div>
                <div className={styles.formCol}>
                  <input
                    name="billing_postcode"
                    onChange={handleChange}
                    placeholder="Postcode"
                    value={formData.billing_postcode || ''}
                  />
                </div>
                <div className={styles.formCol}>
                  <div className={styles.lblSelect}>
                    <span>State/territory</span>
                    <select
                      name="billing_state"
                      onChange={handleChange}
                      value={formData.billing_state || ''}
                    >
                      <option value="">Select state</option>
                      {State.getStatesOfCountry(
                        formData.billing_country || 'AU',
                      ).map(s => (
                        <option key={s.isoCode} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Delivery({
  allowDelivery,
  askCutomerInfo,
  formData,
  setFormData,
  setIsFormFilled,
}) {
  return (
    <div className={styles.drawerContent}>
      <DeliveryAddressForm
        allowDelivery={allowDelivery}
        askCutomerInfo={askCutomerInfo}
        formData={formData}
        setFormData={setFormData}
        setIsFormFilled={setIsFormFilled}
      />
    </div>
  );
}
