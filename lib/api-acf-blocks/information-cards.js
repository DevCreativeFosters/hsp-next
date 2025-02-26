import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const InformationCards = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}InformationCards${blockSuffix} {
      fieldGroupName
      icCards {
        size
        icon {
          node {
            altText
            sourceUrl
          }
        }
        title
        titleTag
        titleTagStyle
        gap
        description
        backgroundImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              height
              width
            }
          }
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
