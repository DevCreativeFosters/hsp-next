import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ButtonLinkTag = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ButtonLinkTag${blockSuffix} {
      fieldGroupName
      buttonText
      buttonLink {
        url
        title
        target
      }
    }
  `;
};
