import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const PostsCarousel = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}PostsCarousel${blockSuffix} {
      fieldGroupName
      title
      description
      numberOfPosts
      postType
      viewAllButton {
        title
        url
        target
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
