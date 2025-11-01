'use client';

import { useRef, useState } from 'react';

import { Autocomplete, useLoadScript } from '@react-google-maps/api';

import SearchIcon from '@assets/icons/search.svg';

import styles from './deliver-to-door.module.scss';

const libraries = ['places'];

function DeliveryAddressForm() {
  const [formData, setFormData] = useState({
    address: '',
    apartment: '',
    city: '',
    firstName: '',
    lastName: '',
    phone: '',
    state: '',
    zip: '',
  });

  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // your maps ID here
    libraries,
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place) return;

    const address = place.formatted_address || '';
    let city = '';
    let state = '';
    let zip = '';

    place.address_components.forEach(component => {
      const types = component.types;
      if (types.includes('locality')) city = component.long_name;
      if (types.includes('administrative_area_level_1'))
        state = component.long_name;
      if (types.includes('postal_code')) zip = component.long_name;
    });

    setFormData(prev => ({
      ...prev,
      address,
      city,
      state,
      zip,
    }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className={styles.deliveryForm}>
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

      <div className={styles.formRow}>
        <div className={styles.formCol}>
          <div className={styles.lblSelect}>
            <span>Country/Region</span>
            <select name="state" onChange={handleChange} value={formData.state}>
              <option value="CA">Australia</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formCol}>
          <input
            name="company-name"
            onChange=""
            placeholder="Company Name (Optional)"
            value=""
          />
        </div>
      </div>

      <Autocomplete
        onLoad={ref => (autocompleteRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
      >
        <div className={styles.formRow}>
          <div className={styles.formCol}>
            <input
              name="address"
              onChange={handleChange}
              placeholder="Address"
              value={formData.address}
            />
            <button className={styles.searchBtn}>
              <SearchIcon />
            </button>
          </div>
        </div>
      </Autocomplete>
      <div className={styles.formRow}>
        <div className={styles.formCol}>
          <input
            name="apartment"
            onChange={handleChange}
            placeholder="Apartment, suite, etc. (optional)"
            value={formData.apartment}
          />
        </div>
      </div>

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
            <select name="state" onChange={handleChange} value={formData.state}>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
            </select>
          </div>
        </div>
        <div className={styles.formCol}>
          <input
            name="zip"
            onChange={handleChange}
            placeholder="PIN code"
            value={formData.zip}
          />
        </div>
      </div>
    </div>
  );
}

function DeliverToDoor({ cartItems }) {
  return (
    <div>
      <DeliveryAddressForm />
    </div>
  );
}

export default DeliverToDoor;
