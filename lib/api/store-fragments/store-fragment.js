export const StoreFragment = `
  fragment StoreFragment on Store {
    id
    databaseId
    title
    slug
    storesCustomFields {
      description
      siteLink {
        title
        url
        target
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }  
      }
      images {
        nodes {
          sourceUrl
          altText
        }
      }
      tradingHours {
        day
        open
        close
      }
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
`;
