import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const Shortcode = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}Shortcode {
      fieldGroupName
      shortcode
    }
  `;
};
