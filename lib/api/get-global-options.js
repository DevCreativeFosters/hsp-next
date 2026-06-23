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
  // getGlobalOptions runs from the ROOT layout, so every single route in
  // the app awaits it during page-data collection at build time. If WP
  // returns a 500 here (Cloudways flake, ACF/WPGraphQL plugin crash, DB
  // hiccup) the entire `next build` fails — we lose a deploy over a
  // backend hiccup that has nothing to do with our code. Catch the error,
  // log it, and return null so the build completes. Layout consumers
  // already null-guard the response (header/footer fall back to empty
  // nav, promo bar hides, etc.) so worst case the page renders without
  // the customised global chrome.
  try {
    const data = await fetchAPI(`{ ${query} }`, {
      tags: ['global-options'],
    });
    return getResult(data);
  } catch (err) {
    console.error(
      'getGlobalOptions failed — rendering with null options:',
      err?.message,
    );
    return null;
  }
}

export function getResult(data) {
  return data?.globalOptions?.optionsCustomFields || null;
}
