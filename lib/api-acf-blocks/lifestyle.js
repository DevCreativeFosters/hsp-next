import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const Lifestyle = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}Lifestyle${blockSuffix} {
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
      }
      posts {
        nodes {
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
      }
      background {
        colorStop {
          color
          position
        }
      }
    }
  `;
};
