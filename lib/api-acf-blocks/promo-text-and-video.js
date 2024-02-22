import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const PromoTextAndVideo = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}PromoTextAndVideo${blockSuffix} {
      fieldGroupName
      title
      description
      learnMoreButton {
        title
        url
      }
      videoFile {
        node {
          mediaItemUrl
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
