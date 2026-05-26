import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const LinksInGroups = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}LinksInGroups${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
      description
      groups {
        title
        links {
          link {
            title
            url
            target
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
