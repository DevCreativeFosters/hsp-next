import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const VideoBackgroundHero = `
  ... on ${BLOCK_PREFIX}VideoBackgroundHero {
    backgroundUrl
    description
    fieldGroupName
    title
    link {
      title
      url
    }
  }
`;
