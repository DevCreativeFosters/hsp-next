import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const IntroAndCards = `
  ... on ${BLOCK_PREFIX}IntroAndCards {
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
  }
`;
