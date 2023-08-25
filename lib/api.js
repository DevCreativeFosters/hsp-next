const API_URL = process.env.WORDPRESS_API_URL;

export async function fetchAPI(
  query = '',
  { variables } = {},
  endpoint = API_URL,
) {
  const headers = { 'Content-Type': 'application/json' };

  if (!endpoint) {
    throw new Error('API_URL is not defined');
  }

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      'Authorization'
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const res = await fetch(endpoint, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    console.debug(query, variables);
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

export async function getAllPosts() {
  const data = await fetchAPI(`
    query AllPosts {
      posts(first: 10000) {
        edges {
          node {
            id
            slug
            title
          }
        }
      }
    }
  `);

  return data?.posts;
}

export async function getPageData(slug) {
  const data = await fetchAPI(`
  query pageBlocks {
    page(id: "/${slug}", idType: URI) {
      flexibleContent {
        blocks {
          ... on Page_Flexiblecontent_Blocks_Hero {
            fieldGroupName
            heroSlides: heroSlide {
              title
              description
              buttonLink {
                title
                url
              }
              backgroundImage {
                sourceUrl
              }
            }
          }
          ... on Page_Flexiblecontent_Blocks_ProductTiles {
            fieldGroupName
            title
            allProductsLink {
              title
              url
            }
            products {
              title
              link {
                url
              }
              productImage {
                sourceUrl
              }
            }
          }
          ... on Page_Flexiblecontent_Blocks_PromoWith2Videos {
            description
            fieldGroupName
            sectionTitle
            buttonLink {
              title
              url
            }
            accessories {
              accessoryName
              price
              videoUrl
              productLink {
                url
              }
            }
          }
          ... on Page_Flexiblecontent_Blocks_CategoriesAndProducts {
            fieldGroupName
            links {
              link {
                title
                url
              }
              product {
                productTitle
                productPrice
                productImage {
                  altText
                  sourceUrl
                }
                imageCoverContain
                productLink {
                  url
                }
              }
            }
          }
          ... on Page_Flexiblecontent_Blocks_Reviews {
            title
            description
            allReviewsLink {
              link {
                title
                url
              }
            }
            fieldGroupName
            reviews {
              score
              reviewText
              reviewerName
            }
          }
          ... on Page_Flexiblecontent_Blocks_FeaturesValues {
            fieldGroupName
            sectionTitle
            description
            videoUrl
            buttonLink {
              title
              url
            }
            attributes {
              description
              title
            }
          }
          ... on Page_Flexiblecontent_Blocks_Lifestyle {
            description
            fieldGroupName
            title
          }
          ... on Page_Flexiblecontent_Blocks_Help {
            fieldGroupName
            title
            description
            helpCards {
              title
              description
              tag
              cardImage {
                altText
                sourceUrl
              }
              cardUrl {
                title
                url
              }
            }
          }
          ... on Page_Flexiblecontent_Blocks_Faq {
            fieldGroupName
            title
            description
            links {
              link {
                title
                url
              }
              isRequestCallbackLink
            }
            questions {
              answer
              question
            }
          }
          ... on Page_Flexiblecontent_Blocks_PromoTextAndVideo {
            description
            fieldGroupName
            title
            videoThumbnailImage {
              altText
              sourceUrl
            }
            videoUrl
          }
          ... on Page_Flexiblecontent_Blocks_IntroAndCards {
            fieldGroupName
            title
            description
            image {
              altText
              sourceUrl
            }
            cards {
              title
              description
              backgroundImage {
                sourceUrl
              }
              image {
                altText
                sourceUrl
              }
            }
          }
          ... on Page_Flexiblecontent_Blocks_Accreditations {
            fieldGroupName
            title
            text
            certificates {
              certificateName
              image {
                altText
                sourceUrl
              }
            }
            membershipsGroup {
              text
              title
            }
          }
        }
      }
    }
  }
`);

  return data?.page?.flexibleContent?.blocks;
}

export async function getMenus() {
  const data = await fetchAPI(`
  {
    menus {
      edges {
        node {
          id
          name
          locations
          menuItems {
            nodes {
              id
              label
              url
            }
          }
        }
      }
    }
  }
`);

  return data?.menus?.edges;
}

export async function getGlobalOptions() {
  const data = await fetchAPI(`
    query GlobalOptions {
      globalOptions {
        optionsCustomFields {
          footerText
          menuItems {
            link
            linkName
            icon {
              sourceUrl
            }
          }
          requestCallbackButton {
            buttonText
            buttonUrl
            buttonIcon {
              sourceUrl
            }
          }
          socialMediaLinks {
            socialMediaLink
            socialMediaIcon {
              sourceUrl
            }
          }
        }
      }
    }
  `);

  return data?.globalOptions?.optionsCustomFields;
}
