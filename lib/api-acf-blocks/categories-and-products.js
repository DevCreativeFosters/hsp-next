import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const CategoriesAndProducts = () => {
  return /* GraphQL */ `
  ... on ${blockPrefix}CategoriesAndProducts${blockSuffix} {
    fieldGroupName
    links {
      link {
        title
        url
      }
      product {
        productTitle
        productPrice
        productImage {
          node {
            altText
            sourceUrl
          }
        }
        imageCoverContain
        productLink {
          url
        }
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
