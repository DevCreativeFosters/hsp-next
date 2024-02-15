import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const PromoImageAndText = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}PromoImageAndText${blockSuffix} {
      fieldGroupName
      title
      description
      image {
        node {
          altText
          sourceUrl
        }
      }
      background {
        colorStop {
          color
          position
        }
      }
    }
  `;
};
