export const COUNTRY_DATA = {
  Australia: {
    callingCode: '61',
    code: 'AU',
  },
  Bulgaria: {
    callingCode: '359',
    code: 'BG',
  },
  'New Zealand': {
    callingCode: '64',
    code: 'NZ',
  },
  Other: {
    callingCode: '',
    code: 'OTHER',
  },
  Thailand: {
    callingCode: '66',
    code: 'TH',
  },
  'US/Canada': {
    callingCode: '1',
    code: 'US',
  },
};

export const DEFAULT_COUNTRY = 'Australia';

const normalizeCountryName = country => {
  if (!country) return DEFAULT_COUNTRY;

  // Remove extra spaces and normalize slashes
  const normalized = country.trim().replace(/\s*\/\s*/g, '/');
  return normalized;
};

export const getCountryCallingCode = country => {
  const normalizedCountry = normalizeCountryName(country);
  return (
    COUNTRY_DATA[normalizedCountry]?.callingCode ||
    COUNTRY_DATA[DEFAULT_COUNTRY].callingCode
  );
};
