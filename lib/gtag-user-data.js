'use client';

import { DEFAULT_COUNTRY, getCountryCallingCode } from './country-codes';

export function updateGtagUserData(formData) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const userData = {};
  const address = {};
  let currentCountry = DEFAULT_COUNTRY;

  // Helper function to format phone number to E.164 as per Google docs
  const formatPhoneNumber = (phone, countryCode = DEFAULT_COUNTRY) => {
    if (!phone) return '';

    const cleaned = phone.replace(/[^\d+]/g, '');
    const callingCode = getCountryCallingCode(countryCode);

    if (cleaned.startsWith('+')) return cleaned;

    const numberWithoutLeadingZero = cleaned.startsWith('0')
      ? cleaned.substring(1)
      : cleaned;

    return `+${callingCode}${numberWithoutLeadingZero}`;
  };

  const setAddressField = (key, value) => {
    if (value) address[key] = value;
  };

  // Process address and country fields first to get correct phone prefix
  formData.forEach(field => {
    const { addressValues, label, type, value } = field;

    if (type === 'ADDRESS' && addressValues?.country) {
      currentCountry = addressValues.country;
      address.country = addressValues.country;
    } else if (type === 'TEXT' || type === 'SELECT') {
      const labelLower = label.toLowerCase();
      if (labelLower.includes('country') && value) {
        currentCountry = value;
        address.country = value;
      }
    }
  });

  // Process all other fields
  formData.forEach(field => {
    const { addressValues, emailValues, label, nameValues, type, value } =
      field;

    switch (type) {
      case 'EMAIL':
        const email = emailValues?.value || value;
        if (email) userData.email = email;
        break;

      case 'PHONE':
        const phone = formatPhoneNumber(value, currentCountry);
        if (phone) userData.phone_number = phone;
        break;

      case 'NAME':
        if (nameValues) {
          setAddressField(
            'first_name',
            nameValues.first || nameValues.firstName,
          );
          setAddressField('last_name', nameValues.last || nameValues.lastName);
        }
        break;

      case 'ADDRESS':
        if (addressValues) {
          setAddressField('street', addressValues.street);
          setAddressField('city', addressValues.city);
          setAddressField('region', addressValues.state);
          setAddressField('postal_code', addressValues.zip);
        }
        break;

      case 'TEXT':
      case 'SELECT':
        const labelLower = label.toLowerCase();

        if (labelLower.includes('first name')) {
          setAddressField('first_name', value);
        } else if (labelLower.includes('last name')) {
          setAddressField('last_name', value);
        } else if (
          labelLower.includes('post code') ||
          labelLower.includes('postal code')
        ) {
          setAddressField('postal_code', value);
        } else if (
          labelLower.includes('city') ||
          labelLower.includes('suburb')
        ) {
          setAddressField('city', value);
        } else if (
          labelLower.includes('street') ||
          labelLower.includes('address')
        ) {
          setAddressField('street', value);
        } else if (
          labelLower.includes('state') ||
          labelLower.includes('region')
        ) {
          setAddressField('region', value);
        }
        break;
    }
  });

  const hasRequiredAddress =
    address.first_name && address.last_name && address.postal_code;

  if (hasRequiredAddress) {
    if (!address.country) address.country = DEFAULT_COUNTRY;
    userData.address = address;
  }

  console.log('Final User Data:', userData);

  if (userData.email || (hasRequiredAddress && userData.address)) {
    try {
      window.gtag('set', 'user_data', userData);
    } catch (error) {
      console.error('Error setting GTM user data:', error);
    }
  }
}
