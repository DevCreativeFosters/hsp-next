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
        }
        variantDetails {
          price
        }
      }
    }
  }
`;
