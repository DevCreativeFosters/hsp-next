import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const TitleAndDescription = `
  ... on ${BLOCK_PREFIX}TitleAndDescription {
    fieldGroupName
    title
    description
    background {
      colorStop {
        color
        position
      }
    }
  }
`;
