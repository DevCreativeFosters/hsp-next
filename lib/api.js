import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

import { Hero } from '@lib/api-acf-blocks/hero';
import { PromoWith2Videos } from '@lib/api-acf-blocks/promo-with-2-videos';
import { PromoTextAndVideo } from '@lib/api-acf-blocks/promo-text-and-video';
import { PromoImageAndText } from '@lib/api-acf-blocks/promo-image-and-text';
import { ProductTiles } from '@lib/api-acf-blocks/product-tiles';
import { CategoriesAndProducts } from '@lib/api-acf-blocks/categories-and-products';
import { Reviews } from '@lib/api-acf-blocks/reviews';
import { FeaturesValues } from '@lib/api-acf-blocks/features-values';
import { Lifestyle } from '@lib/api-acf-blocks/lifestyle';
import { Tiles } from '@lib/api-acf-blocks/tiles';
import { Faq } from '@lib/api-acf-blocks/faq';
import { IntroAndCards } from '@lib/api-acf-blocks/intro-and-cards';
import { Accreditations } from '@lib/api-acf-blocks/accreditations';
import { VideoBackgroundHero } from '@lib/api-acf-blocks/video-background-hero';
import { InformationCards } from '@lib/api-acf-blocks/information-cards';
import { LinksInGroups } from '@lib/api-acf-blocks/links-in-groups';
import { PostsCarousel } from '@lib/api-acf-blocks/posts-carousel';
import { TitleAndDescription } from '@lib/api-acf-blocks/title-and-description';

const blocks = {
  Hero,
  PromoWith2Videos,
  PromoTextAndVideo,
  PromoImageAndText,
  ProductTiles,
  CategoriesAndProducts,
  Reviews,
  FeaturesValues,
  Lifestyle,
  Tiles,
  Faq,
  IntroAndCards,
  Accreditations,
  VideoBackgroundHero,
  InformationCards,
  LinksInGroups,
  PostsCarousel,
  TitleAndDescription,
};

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

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
  let json;
  try {
    json = await res.json();
  } catch (err) {
    console.error('ERR', err);
  }

  if (json?.errors) {
    // console.debug(query);
    //console.error(json.errors);
    throw new Error('Failed to fetch API' + query);
  }

  return json?.data;
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

export async function getPageBlockNames(slug) {
  const data = await fetchAPI(
    `
    query pageBlocks($id: ID!) {
      page(id: $id, idType: URI) {
        flexibleContent {
          blocks {${Object.keys(blocks)
            .map(
              name => `
            ... on ${BLOCK_PREFIX}${name} {
              fieldGroupName
            }`,
            )
            .join('')}
          }
        }
      }
    }
  `,
    {
      variables: {
        id: '/' + slug,
      },
    },
  );

  return data?.page?.flexibleContent?.blocks
    .map(b => b?.fieldGroupName?.split?.(BLOCK_PREFIX)?.[1])
    .filter(Boolean);
}

export async function getPageData(slug) {
  const blocksOrdered = (await getPageBlockNames(slug)) || [];
  const blocksFragments = blocksOrdered.map(blockName => blocks[blockName]);

  const data = await fetchAPI(
    `
    query getPageData($id: ID!) {
      page(id: $id, idType: URI) {
        title
        content
        ${
          blocksFragments.length > 0
            ? `flexibleContent {
            blocks {
              ${blocksFragments}
            }
        }`
            : ''
        }
      }
    }
  `,
    {
      variables: {
        id: '/' + slug,
      },
    },
  );

  return data.page;
}

export async function getLatestNumberOfBlogPosts(number) {
  const data = await fetchAPI(`
    query getLatestNumberOfBlogPosts {
      posts(first: ${number}) {
        nodes {
          title
          slug
          uri
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
            }
          }
          tags {
            nodes {
              name
            }
          }
        }
      }
    }
  `);

  return data;
}

export async function getLatestNumberOfHSPTVPosts(number) {
  const data = await fetchAPI(`
    query getLatestNumberOfHSPTVPosts {
      hspTvPosts(first: ${number}) {
        nodes {
          title
          slug
          uri
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          tags {
            nodes {
              name
            }
          }
        }
      }
    }
  `);

  return data;
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
          featuredPost {
            ... on HspTvPost {
              excerpt
              hspTvPostMainVideo {
                url
              }
              uri
              title
              date
              tags {
                nodes {
                  name
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
        }
      }
    }
  `);

  return data?.globalOptions?.optionsCustomFields;
}

export async function getAllBlogPosts(numberOfPosts) {
  const data = await fetchAPI(
    `
    query GetBlogPosts {
      posts(first: ${numberOfPosts}) {
        nodes {
          date
          featuredImage {
            node {
              sourceUrl
              altText
              title
              mediaDetails {
                width
                height
              }
            }
          }
          id
          uri
          title
          excerpt
          tags {
            nodes {
              name
            }
          }
        }
      }
    }
  `,
  );

  return data;
}

export async function getAllHspTvPosts(numberOfPosts) {
  const data = await fetchAPI(
    `
    query GetHspTVPosts {
      hspTvPosts(first: ${numberOfPosts}) {
        nodes {
          date
          featuredImage {
            node {
              sourceUrl
              altText
              title
              mediaDetails {
                width
                height
              }
            }
          }
          id
          uri
          title
          excerpt
          tags {
            nodes {
              name
            }
          }
        }
      }
    }
    `,
  );

  return data;
}

export async function getBlogPosts(numberOfPosts) {
  const data = await fetchAPI(`
    query blogPosts {
      posts(last: ${numberOfPosts}) {
        nodes {
          title
          uri
        }
      }
    }
  `);

  return data?.posts?.nodes;
}

export async function getBlogPost(slug) {
  const data = await fetchAPI(`
    query blogPost {
      postBy(slug: "${slug}") {
        content
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        excerpt
        title
        uri
      }
    }
  `);

  return data?.postBy;
}

export async function getGravityForm(id) {
  const data = await fetchAPI(
    `
    query GravityForm($id: ID!) {
      gfForm(id: $id, idType: DATABASE_ID) {
        cssClass
        databaseId
        dateCreated
        title
        description
        formId
        formFields {
          nodes {
            layoutGridColumnSpan
            databaseId
            type
            ... on PhoneField {
              id
              label
              cssClass
              description
              isRequired
              placeholder
            }
            ... on EmailField {
              id
              label
              cssClass
              description
              isRequired
              placeholder
            }
            ... on TextField {
              id
              label
              cssClass
              description
              isRequired
              placeholder
            }
            ... on TextAreaField {
              id
              label
              cssClass
              description
              isRequired
              placeholder
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        id: id,
      },
    },
  );

  return data;
}

export async function sendGravityForm(input) {
  const data = await fetchAPI(
    `
      mutation ($input: SubmitGfFormInput!) {
        submitGfForm(input: $input) {
          confirmation {
            type
            message
            url
          }
          errors {
            id
            message
          }
        }
      }
    `,
    {
      variables: {
        input: input,
      },
    },
  );

  return data;
}

export async function getAllStores() {
  const data = await fetchAPI(
    `query getAllStores {
      stores(first: 10000) {
        nodes {
          storesCustomFields {
            addressFields {
              streetAddress
              city
              twCity
              zipCode
              myState
              nzState
              state
              country
            }
            directionsLink
            phoneNumber
            storeLocationCoordinates {
              latitude
              longitude
            }
            storeType
          }
        }
      }
    }
  `,
  );

  return data;
}
