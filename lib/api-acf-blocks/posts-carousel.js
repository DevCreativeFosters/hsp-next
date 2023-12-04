import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const PostsCarousel = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}PostsCarousel {
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
