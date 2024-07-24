import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const FeaturePanels = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}FeaturePanels${blockSuffix} {
      fieldGroupName
      title
      panels {
        label
        media
        image {
          node {
            altText
            sourceUrl
          }
        }
        videoFile {
          node {
            mediaItemUrl
          }
        }
        title
        subtitle
        description
      }
    }
  `;
};
