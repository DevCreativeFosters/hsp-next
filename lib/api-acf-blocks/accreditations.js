import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const Accreditations = `
  ... on ${BLOCK_PREFIX}Accreditations {
    fieldGroupName
    title
    text
    certificates {
      certificateName
      image {
        altText
        sourceUrl
      }
    }
    membershipsGroup {
      text
      title
    }
    background {
      colorStop {
        color
        position
      }
    }
  }
`;
