import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const ProductTiles = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}ProductTiles {
      fieldGroupName
      title
      allProductsLink {
        title
        url
      }
      products {
        title
        startingPrice
        link {
          url
        }
        productImage {
          sourceUrl
        }
      }
    }
  `;
};
