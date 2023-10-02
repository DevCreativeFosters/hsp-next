import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const PostsCarousel = `
  ... on ${BLOCK_PREFIX}PostsCarousel {
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
