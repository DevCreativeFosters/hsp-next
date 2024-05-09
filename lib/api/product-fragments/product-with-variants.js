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
    databaseId
    title
    slug
    compatibleCovers
    compatibleFactoryOptions
    compatibleProducts
    productCategories {
      nodes {
        slug
        categoryRelations {
          icon {
            ${iconNode}
          }
        }
      }
    }
    productFields {
      description
      price
      installationCost
      variants {
        parentInherit
        variantSlug
        variantName
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
        }
      }
    }
  }
`;
