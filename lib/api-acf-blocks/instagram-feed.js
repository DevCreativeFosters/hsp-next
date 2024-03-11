import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const InstagramFeed = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}InstagramFeed${blockSuffix} {
      fieldGroupName
      title
      description
    }
  `;
};
