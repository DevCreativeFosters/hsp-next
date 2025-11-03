'use client';

import { useRef } from 'react';

import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { clsx } from 'clsx';
import { State } from 'country-state-city';

import { useCart } from '@contexts/cart-context';

import Button from '@components/button/button';

import SearchIcon from '@assets/icons/search.svg';

import styles from './deliver-to-door.module.scss';

const libraries = ['places'];

function DeliveryAddressForm({ formData, setFormData, setIsFormFilled }) {
  const { cartItems } = useCart();

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className={styles.deliveryForm}>
      {cartItems.some(item => item.largeItem) ? (
        <div className={styles.redBoxContent}>
          <h5>
            Certain Items In Your Cart Cannot Be Delivered to a Residential
            Address{' '}
          </h5>
          <p>
            Due to the size and nature of products like the Electric Roll Cover,
            Armour Bar, and Load Slides, we can only accommodate shipments to
            commercial or business addresses.
          </p>
        </div>
      ) : (
        <>
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

          <Button
            className={styles.submitBtn}
            disabled={
              !formData.country ||
              !formData.address ||
              !formData.city ||
              !formData.state ||
              !formData.postcode
            }
            onClick={() => setIsFormFilled(true)}
            size="large"
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
}

export default function DeliverToDoor({
  formData,
  setFormData,
  setIsFormFilled,
}) {
  return (
    <div className={styles.drawerContent}>
      <DeliveryAddressForm
        formData={formData}
        setFormData={setFormData}
        setIsFormFilled={setIsFormFilled}
      />
    </div>
  );
}
