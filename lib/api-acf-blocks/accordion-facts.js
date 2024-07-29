import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const AccordionFacts = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}AccordionFacts${blockSuffix} {
      fieldGroupName
      accordionRow {
        accordionTitle
        accordionDescription
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
