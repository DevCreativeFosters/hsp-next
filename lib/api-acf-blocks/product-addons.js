import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const ProductAddons = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}ProductAddons {
      fieldGroupName
      title
      description
      productAddons {
        product {
          ... on Product {
            id
            slug
            title
            uri
            link
            featuredImage {
              node {
                altText
                mediaDetails {
                  height
                  width
                }
                sourceUrl
              }
            }
          }
        }
      }
    }
  `;
};
