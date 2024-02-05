import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const VideoEmbed = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}VideoEmbed {
      fieldGroupName
      embed
    }
  `;
};
