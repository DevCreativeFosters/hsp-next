'use client';

import { useRef, useState } from 'react';

import { Autocomplete, useLoadScript } from '@react-google-maps/api';

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
      <h3>Delivery Address</h3>

      <div className={styles.formRow}>
        <input
          name="firstName"
          onChange={handleChange}
          placeholder="First name"
          value={formData.firstName}
        />
        <input
          name="lastName"
          onChange={handleChange}
          placeholder="Last name"
          value={formData.lastName}
        />
      </div>

      <Autocomplete
        onLoad={ref => (autocompleteRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          name="address"
          onChange={handleChange}
          placeholder="Address"
          value={formData.address}
        />
      </Autocomplete>

      <input
        name="apartment"
        onChange={handleChange}
        placeholder="Apartment, suite, etc. (optional)"
        value={formData.apartment}
      />

      <div className={styles.formRow}>
        <input
          name="city"
          onChange={handleChange}
          placeholder="City"
          value={formData.city}
        />
        <input
          name="state"
          onChange={handleChange}
          placeholder="State"
          value={formData.state}
        />
        <input
          name="zip"
          onChange={handleChange}
          placeholder="PIN code"
          value={formData.zip}
        />
      </div>

      <input
        name="phone"
        onChange={handleChange}
        placeholder="Phone"
        value={formData.phone}
      />
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
