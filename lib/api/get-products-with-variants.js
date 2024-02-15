import { fetchAPI } from '@lib/fetch-api';

export async function getProductsWithVariants(makeSlug, modelSlug) {
  const query = /* GraphQL */ `
    query getProductsWithVariants($makeSlug: [String]!, $modelSlug: [String]!) {
      products(where: { makeSlug: $makeSlug, modelSlug: $modelSlug }) {
        nodes {
          databaseId
          title
          slug
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
      }
    }
  `;

  const data = await fetchAPI(query, {
    variables: {
      makeSlug: makeSlug,
      modelSlug: modelSlug,
    },
  });

  return data.products?.nodes;
}
