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
    const { label, type, value } = field;
    console.log('Processing field:', { label, type, value });
    switch (type) {
      case 'EMAIL':
        userData.email = value;
        break;
      case 'PHONE':
        userData.phone_number = value;
        break;
      case 'TEXT':
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
        } else if (
          labelLower.includes('city') ||
          labelLower.includes('suburb')
        ) {
          userData.city = value;
        } else if (
          labelLower.includes('street') ||
          labelLower.includes('address')
        ) {
          userData.street = value;
        }
        break;
    }
  });

  console.log('Final User Data:', userData);
  console.groupEnd();

  window.gtag('set', 'user_data', userData);
}
