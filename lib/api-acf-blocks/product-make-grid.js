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
      showFilters
      bodyText
      productsPerPage
      productsPerPageMobile
      productsTitleTag
      productsTitleTagStyle
      categoryPages {
        link {
          url
          title
        }
      }
      selectTemplate 
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
