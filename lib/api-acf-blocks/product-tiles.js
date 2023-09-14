import { BLOCK_PREFIX } from './_block-prefix';

export const ProductTiles = `
  ... on ${BLOCK_PREFIX}ProductTiles {
    fieldGroupName
    title
    allProductsLink {
      title
      url
    }
    products {
      title
      link {
        url
      }
      productImage {
        sourceUrl
      }
    }
  }
`;
