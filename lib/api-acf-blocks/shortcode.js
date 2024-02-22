import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const Shortcode = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}Shortcode${blockSuffix} {
      fieldGroupName
      shortcode
    }
  `;
};
