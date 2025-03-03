import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ProductGrid = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ProductGrid${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
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
        titleTag
        titleTagStyle
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
