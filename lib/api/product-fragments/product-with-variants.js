const iconNode = `
  node {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;

export const ProductWithVariants = /* GraphQL */ `
  fragment ProductFragment on Product {
    productCategories {
      nodes {
        categoryRelations {
          icon {
            ${iconNode}
          }
          imageLayerPosition
        }
        name
        parent {
          node {
            id
          }
        }
        slug
      }
    }
    compatibleCovers
    compatibleFactoryOptions
    productFields {
      description
      price
      installationCost
      variants {
        compatibleCategoriesVariants {
          nodes {
            slug
          }
        }
        compatibleCoversVariants {
          nodes {
            slug
          }
        }
        compatibleFactoryOptionsVariants
        parentInherit
        sku
        uteBuilderImages {
          imageDesktop {
            node {
              sourceUrl
              mediaDetails {
                width
                height
              }
            }
          }
          imageMobile {
            node {
              sourceUrl
              mediaDetails {
                width
                height
              }
            }
          }
          icon {
            ${iconNode}
          }
        }
        variantDetails {
          price
          installationCost
        }
        variantName
        variantSlug
      }
    }
    compatibleProducts
    databaseId
    slug
    title
  }
`;
