import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const PromoImageAndText = `
  ... on ${BLOCK_PREFIX}PromoImageAndText {
    fieldGroupName
    title
    description
    image {
      altText
      sourceUrl
    }
  }
`;
