import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const Lifestyle = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}Lifestyle {
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
          hspTvPostCustomFields {
            description
            videoId
            backgroundVideo {
              mediaItemUrl
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
};
