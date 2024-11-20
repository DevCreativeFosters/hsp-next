'use client';

export function updateGtagUserData(formData) {
  if (typeof window === 'undefined' || !window.gtag) return;

  console.group('Google Tag Manager - User Data Update');
  console.log('Raw Form Data:', formData);

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
    const { id, value } = field;
    console.log('Processing field:', { id, value });

    switch (id) {
      case 'email':
        userData.email = value;
        break;
      case 'phone':
        userData.phone_number = value;
        break;
      case 'firstName':
        userData.first_name = value;
        break;
      case 'lastName':
        userData.last_name = value;
        break;
      case 'street':
        userData.street = value;
        break;
      case 'city':
        userData.city = value;
        break;
      case 'postcode':
        userData.postal_code = value;
        break;
    }
  });

  console.log('Final User Data:', userData);
  console.groupEnd();

  window.gtag('set', 'user_data', userData);
}
