import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const CategoriesAndProducts = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
  ... on ${prefix}CategoriesAndProducts {
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
};
