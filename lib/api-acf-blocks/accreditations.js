import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const Accreditations = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}Accreditations${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
      text
      certificates {
        certificateName
        image {
          node {
            altText
            sourceUrl
          }
        }
      }
      membershipsGroup {
        text
        title
        titleTag
        titleTagStyle
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
