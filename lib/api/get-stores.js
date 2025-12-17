import { fetchAPI } from '@lib/fetch-api';

export const query = `
  stores(first: 10000) {
    nodes {
      id
      databaseId
      title
      storesCustomFields {
        addressFields {
          city
          cityTw
          country
          state
          stateMy
          stateNz
          streetAddress
          postalCode
        }
        directionsLink
        inStoreDisplays {
          productCategory {
            nodes {
              databaseId
              name
              ... on WithAcfMainCategoryDetails {
                mainCategoryDetails {
                  inStoreImage {
                    node {
                      mediaItemUrl
                    }
                  }
                }
              }
            }
          }
        }
        learnMore {
          title
          url
        }
        phoneNumber
        productInstallationCost {
          installationCost
          product {
            nodes {
              id
              slug
            }
          }
        }
        storeId
        storeLocationCoordinates {
          latitude
          longitude
        }
        rankingMultiplier
      }
      storeCategories {
        nodes {
          name
          slug
          storeCategoryCustomFields {
            color
            icon {
              node {
                sourceUrl
              }
            }
            pinIcon {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;

export async function getStores() {
  const data = await fetchAPI(`{ ${query} }`, {
    tags: ['store'],
  });
  return getResult(data);
}

export function getResult(data) {
  return data?.stores?.nodes || [];
}
