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

  // When the Address Details card at the top of the checkout collects the
  // primary address AND the customer leaves "delivery same as above"
  // ticked, the Deliver-to-Door drawer just shows a summary. When they
  // untick it, this drawer collects a SEPARATE delivery address into the
  // delivery_* formData fields. For drop-ship-to-customer (askCutomerInfo
  // === true) we always collect the customer's address into the primary
  // formData fields — that flow doesn't pair with the toggle.
  const deliverySameAsBilling = formData.delivery_same_as_billing !== false;
  const useAltAddress = !askCutomerInfo && !deliverySameAsBilling;
  const fieldPrefix = useAltAddress ? 'delivery_' : '';
  const f = key => `${fieldPrefix}${key}`;

  // Deliver-to-Store + "delivery same as billing" + no commercial
  // confirmation needed = there's literally nothing to fill in on this
  // drawer. The destination is the dealer's store address from Contact
  // Details, and the selection itself IS the user's confirmation that
  // they want this option. Auto-advance straight to the payment section
  // so the dealer doesn't have to click a Confirm button that does
  // nothing functional. Must live BELOW deliverySameAsBilling/
  // showCommercialConfirmation so we don't TDZ-reference them.
  //
  // `allowDelivery` means the option requires the customer to enter a
  // delivery address (deliver-to-door, drop-shipping-to-customer) — for
  // those we always render the form + confirm-address button, never
  // the auto-advance summary card.
  const autoAdvance =
    !askCutomerInfo &&
    !allowDelivery &&
    deliverySameAsBilling &&
    !showCommercialConfirmation;
  useEffect(() => {
    if (autoAdvance) setIsFormFilled(true);
  }, [autoAdvance, setIsFormFilled]);

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
      [f('address')]: address,
      [f('city')]: city,
      [f('postcode')]: postcode,
      [f('state')]: state,
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

  // Showing the alternate-delivery form (or any address form for drop-ship)
  // means we need to validate the user filled the field set we're actually
  // collecting into. When it's just a summary card (toggle ticked, not a
  // drop-ship) we trust the primary address that was confirmed upstream on
  // the Address Details card.
  const country = formData[f('country')] ?? (useAltAddress ? 'AU' : 'AU');
  const company = formData[f('company')] ?? '';
  const street = formData[f('address')] ?? '';
  const apt = formData[f('address_2')] ?? '';
  const city = formData[f('city')] ?? '';
  const state = formData[f('state')] ?? '';
  const postcode = formData[f('postcode')] ?? '';

  const formIncomplete =
    !street || !city || !state || !postcode || !acceptDeliveryTerms;

  return (
    <div className={styles.deliveryForm}>
      <>
        {hasLargeItem && (
          // Warning banner shown for ANY heavy-item delivery flow.
          <div className={clsx(styles.redBoxContent, styles.warning)}>
            <h5>Commercial Address Required for Delivery</h5>
            <p>
              Some products — including the Electric Roll Cover, Armour Bar and
              Load Slides — can only be delivered to commercial or business
              addresses due to their size and handling requirements. Enter your
              delivery address below and confirm it&rsquo;s a commercial
              address.
            </p>
          </div>
        )}

        {/* $20 freight fee disclosure — drop-shipping only. Deliver-to-
            Store ships to the dealer's store address (no per-order freight
            charge for that path), and pickup-from-HSP has no freight. */}
        {askCutomerInfo && (
          <div className={styles.freightNotice}>
            A <strong>$20 freight fee</strong> applies to drop-shipping orders.
          </div>
        )}

        {!askCutomerInfo && !allowDelivery && deliverySameAsBilling ? (
          // Summary card. For B2B/dealer Deliver-to-Store the destination
          // IS the dealer's own store address (rendered on the Contact
          // Details card above as the dealerAddressLine). They aren't
          // expected to re-type it on an Address Details form — the old
          // "Please enter your address in the Address Details section
          // above" copy was wrong for this flow. Show a clear
          // confirmation instead.
          //
          // Options with allowDelivery=true (deliver-to-door,
          // drop-shipping-to-customer) skip this branch and always
          // render the address form below — the customer needs to
          // enter a destination.
          <div className={styles.addressSummaryCard}>
            <h4>Delivery Address</h4>
            {formData.address ? (
              <p>
                {formData.address}
                {formData.address_2 ? `, ${formData.address_2}` : ''}
                <br />
                {formData.city}
                {formData.city && (formData.state || formData.postcode)
                  ? ', '
                  : ''}
                {formData.state} {formData.postcode}
                {(formData.state || formData.postcode) && formData.country
                  ? ', '
                  : ''}
                {formData.country}
              </p>
            ) : (
              <p>
                Your order will be shipped to your store address shown in
                Contact Details above.
              </p>
            )}
          </div>
        ) : (
          <>
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
                      value={
                        formData.additionalCustomerInfo?.customer_first_name
                      }
                    />
                  </div>
                  <div className={styles.formCol}>
                    <input
                      name="additionalCustomerInfo.customer_last_name"
                      onChange={handleChange}
                      placeholder="Last Name"
                      value={
                        formData.additionalCustomerInfo?.customer_last_name
                      }
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

            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <div className={styles.lblSelect}>
                  <span>Country/Region</span>
                  <select
                    name={f('country')}
                    onChange={handleChange}
                    value={country}
                  >
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {!askCutomerInfo && (
              <div className={styles.formRow}>
                <div className={styles.formCol}>
                  <input
                    name={f('company')}
                    onChange={handleChange}
                    placeholder="Company Name (Optional)"
                    value={company}
                  />
                </div>
              </div>
            )}

            <Autocomplete
              onLoad={autocomplete => {
                autocompleteRef.current = autocomplete;
                autocomplete.setComponentRestrictions({
                  country: (country || 'AU').toLowerCase(),
                });

                setTimeout(() => {
                  const pacContainer = document.querySelector('.pac-container');
                  if (pacContainer) pacContainer.classList.add('pacContainer');

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
                    name={f('address')}
                    onChange={handleChange}
                    placeholder="Address (We do not ship to PO Boxes)"
                    value={street}
                  />
                  <button className={styles.searchBtn} type="button">
                    <SearchIcon />
                  </button>
                </div>
              </div>
            </Autocomplete>

            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <input
                  name={f('address_2')}
                  onChange={handleChange}
                  placeholder="Apartment, suite, etc. (optional)"
                  value={apt}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <input
                  name={f('city')}
                  onChange={handleChange}
                  placeholder="City"
                  value={city}
                />
              </div>
              <div className={styles.formCol}>
                <div className={styles.lblSelect}>
                  <span>State/Territory</span>
                  <select
                    name={f('state')}
                    onChange={handleChange}
                    value={state}
                  >
                    <option value="">Select state</option>
                    {State.getStatesOfCountry(country || 'AU').map(s => (
                      <option key={s.isoCode} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formCol}>
                <input
                  name={f('postcode')}
                  onChange={handleChange}
                  placeholder="Postcode"
                  value={postcode}
                />
              </div>
            </div>
          </>
        )}

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
                    I confirm that my delivery address is a commercial address,
                    and I understand that any additional fees arising from
                    providing a residential address will be my responsibility.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Hide the Confirm Address button for the Deliver-to-Store
            flow in summary mode. There's literally nothing to confirm
            — the destination is the dealer's store address from
            Contact Details and there's no per-flow input on this
            drawer. The selection itself IS the confirmation; we
            auto-advance via the useEffect below. The button stays
            for the drop-shipping flow (askCutomerInfo) where the
            dealer fills in customer details. */}
        {(askCutomerInfo || allowDelivery || !deliverySameAsBilling) && (
          <Button
            className={styles.submitBtn}
            disabled={
              (!askCutomerInfo && !allowDelivery && deliverySameAsBilling
                ? !acceptDeliveryTerms || !formData.address
                : formIncomplete) ||
              (showCommercialConfirmation && !acceptDeliveryTerms)
            }
            onClick={() => setIsFormFilled(true)}
            size="large"
          >
            Confirm Address
          </Button>
        )}
      </>
    </div>
  );
}

export default function Delivery({
  allowDelivery,
  askCutomerInfo,
  formData,
  setFormData,
  setIsFormFilled,
  showUseBillingAsShipping,
}) {
  useEffect(() => {
    if (showUseBillingAsShipping && formData.delivery_same_as_billing) {
      setFormData(prev => ({
        ...prev,
        delivery_address: prev.address,
        delivery_address_2: prev.address_2,
        delivery_city: prev.city,
        delivery_company: prev.deliveryCompanyName,
        delivery_country: prev.country,
        delivery_postcode: prev.postcode,
        delivery_state: prev.state,
      }));
    }
  }, [
    formData.address,
    formData.address_2,
    formData.city,
    formData.country,
    formData.delivery_same_as_billing,
    formData.deliveryCompanyName,
    formData.postcode,
    formData.state,
    showUseBillingAsShipping,
  ]);

  return (
    <div className={styles.drawerContent}>
      {showUseBillingAsShipping && (
        <div className={styles.colFull}>
          <div className={styles.deliverySameBar}>
            <label>
              <input
                checked={formData.delivery_same_as_billing !== false}
                name="delivery_same_as_billing"
                onChange={e => {
                  console.log(e.target.checked);
                  if (e.target.checked === false) {
                    setFormData(prev => ({
                      ...prev,
                      delivery_address: '',
                      delivery_address_2: '',
                      delivery_city: '',
                      delivery_company: '',
                      delivery_country: '',
                      delivery_postcode: '',
                      delivery_state: '',
                    }));
                  }

                  setFormData(prev => ({
                    ...prev,
                    delivery_same_as_billing: e.target.checked,
                  }));
                }}
                type="checkbox"
              />
              <span>
                The billing address and shipping address are the same.
              </span>
            </label>
          </div>
        </div>
      )}
      {showUseBillingAsShipping && formData.delivery_same_as_billing && (
        <Button
          className={styles.submitBtn}
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              delivery_address: prev.address,
              delivery_address_2: prev.address_2,
              delivery_city: prev.city,
              delivery_company: prev.deliveryCompanyName,
              delivery_country: prev.country,
              delivery_postcode: prev.postcode,
              delivery_state: prev.state,
            }));
            setIsFormFilled(true);
          }}
          size="large"
        >
          Confirm Address
        </Button>
      )}
      {!(formData.delivery_same_as_billing && showUseBillingAsShipping) && (
        <DeliveryAddressForm
          allowDelivery={allowDelivery}
          askCutomerInfo={askCutomerInfo}
          formData={formData}
          setFormData={setFormData}
          setIsFormFilled={setIsFormFilled}
        />
      )}
    </div>
  );
}
