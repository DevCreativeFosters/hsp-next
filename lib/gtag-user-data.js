'use client';

export function updateGtagUserData(formData) {
  if (typeof window === 'undefined' || !window.gtag) return;

  console.group('Google Tag Manager - User Data Update');
  console.log('Raw formData:', formData);

  const userData = {};
  const address = {};

  // Helper function to format phone number to E.164 as per Google docs
  const formatPhoneNumber = phone => {
    if (!phone) return '';

    const cleaned = phone.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('+')) return cleaned;

    return cleaned.startsWith('0')
      ? '+61' + cleaned.substring(1)
      : '+61' + cleaned;
  };

  const setAddressField = (key, value) => {
    if (value) address[key] = value;
  };

  formData.forEach(field => {
    const { addressValues, emailValues, label, nameValues, type, value } =
      field;
    console.log('Processing field:', field);

    switch (type) {
      case 'EMAIL':
        const email = emailValues?.value || value;
        if (email) userData.email = email;
        break;

      case 'PHONE':
        const phone = formatPhoneNumber(value);
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
          if (addressValues.country) address.country = addressValues.country;
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
        } else if (labelLower.includes('country')) {
          if (value) address.country = value;
        }
        break;
    }
  });

  const hasRequiredAddress =
    address.first_name && address.last_name && address.postal_code;

  if (hasRequiredAddress) {
    if (!address.country) address.country = 'AU';
    userData.address = address;
  }

  console.log('Final User Data:', userData);
  console.groupEnd();

  if (userData.email || (hasRequiredAddress && userData.address)) {
    window.gtag('set', 'user_data', userData);
  }
}
