import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const VideoCarousel = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}VideoCarousel${blockSuffix} {
      fieldGroupName
      description
      title
      titleTag
      titleTagStyle
      button {
        title
        url
      }
      hspCelebrityPosts {
        nodes {
          ... on Celebrity {
            id
            title
            slug
            celebrityPostsCustomFields {
              thumbnail {
                node {
                  altText
                  sourceUrl
                }
              }
              video {
                node {
                  mediaItemUrl
                }
              }
            }
          }
        }
      }
    }
  `;
};
