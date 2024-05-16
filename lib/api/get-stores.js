import { fetchAPI } from '@lib/fetch-api';

export async function getStores() {
  const query = /* GraphQL */ `
    query getStores {
      stores(first: 10000) {
        nodes {
          id
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
            storeCategory
            storeId
            storeLocationCoordinates {
              latitude
              longitude
            }
            rankingMultiplier
          }
        }
      }
    }
  `;

  const data = await fetchAPI(query);

  return data?.stores?.nodes || [];
}
