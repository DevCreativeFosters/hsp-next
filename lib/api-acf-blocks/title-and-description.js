import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const TitleAndDescription = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}TitleAndDescription${blockSuffix} {
      fieldGroupName
      layoutVariant
      title
      titleTag
      titleTagStyle
      description
      background {
        colorStop {
          color
          position
        }
      }
    }
  `;
};
