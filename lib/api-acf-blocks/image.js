import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const Image = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}Image${blockSuffix} {
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
