import { fetchAPI } from '@lib/fetch-api';

// Products to suggest in the /cart "More Accessories to Add:"
// carousel. These are selected in the WordPress ACF Options Page
// under "Cart Accessories".
const QUERY = `
  query CartAccessories($count: Int = 1000) {
    globalOptions {
      optionsCustomFields {
        cartAccessories(first: $count) {
          nodes {
            __typename
            ... on Product {
              databaseId
              slug
              title
              commentCount
              comments(first: 100) {
                nodes {
                  rating
                }
              }
              productCategories(first: 1) {
                nodes {
                  name
                }
              }
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              productFields {
                price
                installationCost
                freight
                images {
                  nodes {
                    mediaItemUrl
                    altText
                  }
                }
                variants {
                  variantName
                  variantSlug
                  sku
                  parentInherit
                  variantDetails {
                    price
                    compareAtPrice
                    installationCost
                    images {
                      nodes {
                        mediaItemUrl
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCartAccessories(count = 4) {
  try {
    const data = await fetchAPI(QUERY, {
      tags: ['product', 'cart-accessories'],
      variables: { count },
    });

    const accessories =
      data?.globalOptions?.optionsCustomFields?.cartAccessories?.nodes || [];

    // Guard against non-Product nodes (interface can resolve other types)
    return accessories.filter(node => node?.__typename === 'Product');
  } catch (err) {
    console.error('getCartAccessories failed:', err?.message);
    return [];
  }
}
