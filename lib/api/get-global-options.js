import { fetchAPI } from '@lib/fetch-api';

export const query = `
  globalOptions {
    optionsCustomFields {
      footerText
      menuItems {
        isRequestCallbackButton
        isPhoneNumber
        displayOnMobile
        link {
          url
          title
        }
        icon {
          node {
            sourceUrl
          }
        }
        iconPredefined
      }
      # PROMO -- START
      promoBackgroundColor
      promoTextColor
      scrollAnimation
      promoContent {
        image {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        text
      }
      # PROMO -- END
      socialMediaLinks {
        socialMediaIconPredefined
        socialMediaIcon {
          node {
            sourceUrl
          }
        }
        socialMediaLink
      }
      featuredPost {
        nodes {
          ... on HspTvPost {
            excerpt
            hspTvPostCustomFields {
              description
              videoId
              backgroundVideo {
                node {
                  mediaItemUrl
                }
              }
            }
            uri
            slug
            title
            date
            tags {
              nodes {
                name
              }
            }
          }
        }
      }
      contactUsInfo
      servicesBox {
        link {
          title
          url
          target
        }
      }
      enquiryFormId
      downloadFileFormId
      newsletterTitle
      newsletterDescription
      coversCategory {
        nodes {
          databaseId
          id
          name
          slug
        }
      }
      compatibleFactoryOptions {
        nodes {
          databaseId
          id
          name
          slug
        }
      }
      noCoverCategory {
        nodes {
          databaseId
          id
          name
          slug
        }
      }
      igToken
    }
  }
`;

export async function getGlobalOptions() {
  const data = await fetchAPI(`{ ${query} }`, {
    tags: ['global-options'],
  });

  return getResult(data);
}

export function getResult(data) {
  return data?.globalOptions?.optionsCustomFields || null;
}
