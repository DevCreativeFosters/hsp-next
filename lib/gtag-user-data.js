'use client';

export function updateGtagUserData(formData) {
  if (typeof window === 'undefined' || !window.gtag) return;

  console.group('Google Tag Manager - User Data Update');
  console.log('Raw formData:', formData);

  // Map form field values to gtag user data
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
    // Handle email fields
    if (field.emailValues?.value) {
      userData.email = field.emailValues.value;
    }

    // Handle name fields
    if (field.nameValues) {
      if (field.nameValues.firstName) {
        userData.first_name = field.nameValues.firstName;
      }
      if (field.nameValues.lastName) {
        userData.last_name = field.nameValues.lastName;
      }
    }

    // Handle address fields
    if (field.addressValues) {
      if (field.addressValues.street) {
        userData.street = field.addressValues.street;
      }
      if (field.addressValues.city) {
        userData.city = field.addressValues.city;
      }
      if (field.addressValues.zip) {
        userData.postal_code = field.addressValues.zip;
      }
      if (field.addressValues.country) {
        userData.country = field.addressValues.country;
      }
    }

    // Handle phone fields
    if (field.type === 'PHONE' && field.value) {
      userData.phone_number = field.value;
    }
  });

  console.log('Final User Data:', userData);
  console.groupEnd();

  // Update gtag user data
  window.gtag('set', 'user_data', userData);
}
