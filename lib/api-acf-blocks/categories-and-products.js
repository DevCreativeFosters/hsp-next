import { BLOCK_PREFIX } from './_block-prefix';

export const CategoriesAndProducts = `
  ... on ${BLOCK_PREFIX}CategoriesAndProducts {
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
          altText
          sourceUrl
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
