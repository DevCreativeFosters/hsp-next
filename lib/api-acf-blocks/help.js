import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const Help = `
  ... on ${BLOCK_PREFIX}Help {
    fieldGroupName
    title
    description
    helpCards {
      title
      description
      tag
      cardImage {
        altText
        sourceUrl
      }
      cardUrl {
        title
        url
      }
    }
  }
`;
