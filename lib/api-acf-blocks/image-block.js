import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const ImageBlock = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}ImageBlock${blockSuffix} {
      fieldGroupName
      desktopImage {
        node {
          altText
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
      mobileImage {
        node {
          altText
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
    }
  `;
};
