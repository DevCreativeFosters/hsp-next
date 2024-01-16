import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const ProductGrid = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}ProductGrid {
      fieldGroupName
      title
      products {
        link {
          url
        }
        productImage {
          mediaItemUrl
        }
        title
      }
    }
  `;
};
