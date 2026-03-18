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
    compatibleCovers
    compatibleFactoryOptions
    compatibleProducts
    databaseId
    noCover
    productCategories {
      nodes {
        categoryRelations {
          icon {
            ${iconNode}
          }
          imageLayerPosition
          order
          dontIncludeInTheUteBuilder
        }
        mainCategoryDetails {
          dontCreateL1AndL2PageNorFeatureInTheProductsDropdownAndPage
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
    productFields {
      description
      price
      installationCost
      freight
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
          multipleImages {
            desktop {
              node {
                altText
                sourceUrl
              }
            }
            mobile {
              node {
                altText
                sourceUrl
              }
            }
            layerPosition
          }
        }
        variantDetails {
          price
          compareAtPrice
          installationCost
        }
        variantName
        variantSlug
      }
    }
    slug
    title
  }
`;
