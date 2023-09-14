import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const PromoTextAndVideo = `
  ... on ${BLOCK_PREFIX}PromoTextAndVideo {
    fieldGroupName
    title
    description
    learnMoreButton {
      title
      url
    }
    videoUrl
    background {
      colorStop {
        color
        position
      }
    }
  }
`;
