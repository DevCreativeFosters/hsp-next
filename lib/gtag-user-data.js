'use client';

export function updateGtagUserData(formData) {
  if (typeof window === 'undefined' || !window.gtag) return;

  console.group('Google Tag Manager - User Data Update');
  console.log('Raw formData:', formData);

  const userData = {
    city: '',
    country: 'AU',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    postal_code: '',
    street: '',
  };

  formData.forEach(field => {
    const { addressValues, emailValues, label, nameValues, type, value } =
      field;
    console.log('Processing field:', {
      addressValues,
      emailValues,
      label,
      nameValues,
      type,
      value,
    });

    if (type === 'EMAIL') {
      userData.email = emailValues?.value || value;
    } else if (type === 'PHONE') {
      userData.phone_number = value;
    } else if (type === 'NAME' && nameValues) {
      userData.first_name = nameValues.first || nameValues.firstName || '';
      userData.last_name = nameValues.last || nameValues.lastName || '';
    } else if (type === 'ADDRESS' && addressValues) {
      userData.street = addressValues.street || '';
      userData.city = addressValues.city || '';
      userData.postal_code = addressValues.zip || '';
      userData.country = addressValues.country || 'AU';
    } else if (type === 'TEXT') {
      const labelLower = label.toLowerCase();
      if (labelLower.includes('first name')) {
        userData.first_name = value;
      } else if (labelLower.includes('last name')) {
        userData.last_name = value;
      } else if (
        labelLower.includes('post code') ||
        labelLower.includes('postal code')
      ) {
        userData.postal_code = value;
      } else if (labelLower.includes('city') || labelLower.includes('suburb')) {
        userData.city = value;
      } else if (
        labelLower.includes('street') ||
        labelLower.includes('address')
      ) {
        userData.street = value;
      } else if (labelLower.includes('country')) {
        userData.country = value || 'AU';
      }
    } else if (type === 'SELECT') {
      const selectLabelLower = label.toLowerCase();
      if (selectLabelLower.includes('country')) {
        userData.country = value || 'AU';
      }
    }
  });

  console.log('Final User Data:', userData);
  console.groupEnd();

  window.gtag('set', 'user_data', userData);
}
