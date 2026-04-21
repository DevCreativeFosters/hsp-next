import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const PostsCarousel = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}PostsCarousel${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
      description
      numberOfPosts
      postType
      tagId
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
