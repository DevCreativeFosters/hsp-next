import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const FeaturePanels = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}FeaturePanels${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
      alignment
      panels {
        label
        titleTag
        titleTagStyle
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
        description
      }
    }
  `;
};
