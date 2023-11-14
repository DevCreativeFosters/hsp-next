import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const VideoCarousel = `
  ... on ${BLOCK_PREFIX}VideoCarousel {
    fieldGroupName
    description
    title
    button {
      title
      url
    }
    hspCelebrityPosts {
      ... on Celebrity {
        id
        title
        celebrityPostsCustomFields {
          thumbnail {
            altText
            sourceUrl
          }
          video {
            mediaItemUrl
          }
        }
      }
    }
  }
`;
