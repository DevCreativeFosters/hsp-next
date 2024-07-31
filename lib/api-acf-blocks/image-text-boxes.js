import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ImageTextBoxes = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ImageTextBoxes${blockSuffix} {
      fieldGroupName
      boxes {
        layout
        title
        description
        ctaButton {
          title
          url
          target
        }
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
      }
    }
  `;
};
