import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ProductTiles = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ProductTiles${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
      allProductsLink {
        title
        url
      }
      products {
        title
        titleTag
        titleTagStyle
        startingPrice
        link {
          url
        }
        productImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `;
};
