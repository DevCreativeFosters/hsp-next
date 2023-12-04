import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const IntroAndCards = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}IntroAndCards {
      fieldGroupName
      title
      description
      cards {
        title
        description
        backgroundImage {
          sourceUrl
        }
        image {
          altText
          sourceUrl
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
