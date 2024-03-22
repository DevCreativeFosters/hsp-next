import { fetchAPI } from '@lib/fetch-api';

export async function getGlobalOptions() {
  const query = /* GraphQL */ `
    query getGlobalOptions {
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
        }
      }
    }
  `;

  const data = await fetchAPI(query);

  return data.globalOptions?.optionsCustomFields || null;
}
