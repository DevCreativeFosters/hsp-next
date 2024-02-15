import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const VideoEmbed = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}VideoEmbed${blockSuffix} {
      fieldGroupName
      embed
    }
  `;
};
