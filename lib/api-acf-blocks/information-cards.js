import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const InformationCards = `
  ... on ${BLOCK_PREFIX}InformationCards {
    fieldGroupName
    cards {
      size
      icon {
        altText
        sourceUrl
      }
      title
      gap
      description
      backgroundImage {
        sourceUrl
        altText
        mediaDetails {
          height
          width
        }
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
