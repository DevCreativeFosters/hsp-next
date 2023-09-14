import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const Lifestyle = `
  ... on ${BLOCK_PREFIX}Lifestyle {
    fieldGroupName
    title
    description,
    buttons {
      label
      variant
      link {
        url
      }
      withArrowForwardIcon
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
            link
          }
        }
        featuredImage {
          node {
            altText
            mediaDetails {
              height
              width
            }
            sourceUrl
          }
          cursor
        }
      }
    }
    posts {
      ... on Post {
        date
        title
        excerpt
        link
        tags {
          nodes {
            name
            link
          }
        }
        featuredImage {
          node {
            altText
            mediaDetails {
              height
              width
            }
            sourceUrl
          }
          cursor
        }
      }
      ... on HspTvPost {
        date
        title
        excerpt
        link
        tags {
          nodes {
            name
            link
          }
        }
        featuredImage {
          node {
            altText
            mediaDetails {
              height
              width
            }
            sourceUrl
          }
          cursor
        }
      }
    }
    background {
      colorStop {
        color
        position
      }
    }
  }
`;
