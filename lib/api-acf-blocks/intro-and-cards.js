import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const IntroAndCards = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}IntroAndCards${blockSuffix} {
      fieldGroupName
      title
      description
      cards {
        title
        description
        backgroundImage {
          node {
            sourceUrl
          }
        }
        image {
          node {
            altText
            sourceUrl
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
