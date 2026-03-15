export const StoreFragment = `
  fragment StoreFragment on Store {
    id
    databaseId
    title
    slug
    assignedB2bUser
    storesCustomFields {
      description
      siteLink {
        title
        url
        target
      }
      marketingResources {
        link {
          url
          title
        }
      }
      blocks {
        title
        description
        image {
          node {
            sourceUrl
            altText
          }
        }
        link {
          url
          title
        }
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
      deliveryAddress {
        addressName
        aptunit
        city
        cityTw
        country
        state
        stateMy
        stateNz
        streetAddress
        postalCode
      }
      billingAddress {
        addressName
        aptunit
        city
        cityTw
        country
        state
        stateMy
        stateNz
        streetAddress
        postalCode
      }
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
