import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const InstagramFeed = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}InstagramFeed {
      fieldGroupName
      title
      description
    }
  `;
};
