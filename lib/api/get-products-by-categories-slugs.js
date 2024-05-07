import { blocks } from '@lib/blocks';
import { fetchAPI } from '@lib/fetch-api';

export async function getProductsByCategoriesSlugs(
  mainCategorySlug,
  makeSlug,
  modelSlug,
) {
  const blocksFragments = Object.values(blocks).map(block => block('product'));

  const query = /* GraphQL */ `
    query getProductsByCategoriesSlugs(
      $mainCategorySlug: [String]!
      $makeSlug: [String]!
      $modelSlug: [String]!
    ) {
      products(
        where: {
          mainCategorySlug: $mainCategorySlug
          makeSlug: $makeSlug
          modelSlug: $modelSlug
        }
      ) {
        nodes {
          title
          slug
          productFields {
            manualsDescription
            manualPdfItems {
              manualPdf {
                node {
                  mediaItemUrl
                  title
                }
              }
            }
            images {
              nodes {
                mediaItemUrl
                mediaDetails {
                  width
                  height
                }
                altText
              }
            }
            description
            price
            installationCost
            warrantyTimePeriod
            warrantyDescription
            featuresDescription
            featuresBoxes {
              icon {
                node {
                  mediaItemUrl
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              title
              content
              video {
                node {
                  mediaItemUrl
                  mediaDetails {
                    width
                    height
                  }
                }
              }
              image {
                node {
                  mediaItemUrl
                  mediaDetails {
                    width
                    height
                  }
                }
              }
            }
            specificationDescription
            specification
            variants {
              sku
              parentInherit
              variantName
              variantSlug
              uteBuilderImages {
                imageDesktop {
                  node {
                    sourceUrl
                  }
                }
              }
              variantDetails {
                images {
                  nodes {
                    mediaItemUrl
                    mediaDetails {
                      width
                      height
                    }
                    altText
                  }
                }
                description
                price
                installationCost
                warrantyTimePeriod
                warrantyDescription
                featuresDescription
                featuresBoxes {
                  icon {
                    node {
                      mediaItemUrl
                      mediaDetails {
                        width
                        height
                      }
                    }
                  }
                  title
                  content
                  video {
                    node {
                      mediaItemUrl
                      mediaDetails {
                        width
                        height
                      }
                    }
                  }
                  image {
                    node {
                      mediaItemUrl
                      mediaDetails {
                        width
                        height
                      }
                    }
                  }
                }
                specificationDescription
                specification
                manualsDescription
                manualPdfItems {
                  manualPdf {
                    node {
                      mediaItemUrl
                      title
                    }
                  }
                }
              }
            }
          }
          flexibleContent {
            blocks {
              ${blocksFragments}
            }
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      mainCategorySlug: mainCategorySlug,
      makeSlug: makeSlug,
      modelSlug: modelSlug,
    },
  });

  return data?.products?.nodes || [];
}
