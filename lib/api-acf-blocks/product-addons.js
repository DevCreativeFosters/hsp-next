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
        productCategory {
          nodes {
            ... on Product_category {
              id
              name
              slug
              mainCategoryDetails {
                fromPrice
                featuredImage {
                  node {
                    mediaItemUrl
                  }
                }
              }
            }
          }
        }
        productMake {
          nodes {
            ... on Make_and_model {
              id
              name
              slug
              detailsFields {
                details {
                  fromPrice
                  featuredImage {
                    node {
                      mediaItemUrl
                    }
                  }
                  relatedProductCategory {
                    nodes {
                      ... on Product_category {
                        id
                        name
                        slug
                      }
                    }
                  }
                }
              }
            }
          }
        }
        productMakeRelatedProductCategory {
          nodes {
            ... on Product_category {
              id
            }
          }
        }
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
