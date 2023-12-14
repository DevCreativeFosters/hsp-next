import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const VideoCarousel = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}VideoCarousel {
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
          slug
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
};
