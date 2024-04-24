import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ProductGrid = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ProductGrid${blockSuffix} {
      fieldGroupName
      title
      products {
        link {
          url
        }
        productImage {
          node {
            mediaItemUrl
          }
        }
        title
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
