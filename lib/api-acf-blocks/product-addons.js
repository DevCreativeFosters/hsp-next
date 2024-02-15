import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ProductAddons = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ProductAddons${blockSuffix} {
      fieldGroupName
      title
      description
      productAddons {
        product {
          node {
            ... on Product {
              id
              slug
              title
              uri
              link
              productCategories {
                nodes {
                  slug
                }
              }
              makesAndModels {
                nodes {
                  slug
                  name
                  taxonomyName
                  parent {
                    node {
                      name
                      slug
                    }
                  }
                }
              }
              productFields {
                price
                variants {
                  variantSlug
                  sku
                  variantDetails {
                    price
                  }
                }
              }
              featuredImage {
                node {
                  altText
                  sourceUrl
                  mediaDetails {
                    height
                    width
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
};
