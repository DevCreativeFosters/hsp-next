import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const VideoBackgroundHero = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}VideoBackgroundHero${blockSuffix} {
      backgroundFile {
        node {
          mediaItemUrl
        }
      }
      description
      fieldGroupName
      title
      link {
        title
        url
      }
    }
  `;
};
