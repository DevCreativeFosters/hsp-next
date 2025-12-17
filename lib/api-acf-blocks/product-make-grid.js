import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ProductMakeGrid = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ProductMakeGrid${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
      alignment
      bodyText
      productsPerPage
      productsPerPageMobile
      productsTitleTag
      productsTitleTagStyle
      products {
        link {
          url
        }
        title
        productImage {
          node {
            mediaItemUrl
          }
        }
        startingPrice
        dateAdded
        popularity
      }
    }
  `;
};
