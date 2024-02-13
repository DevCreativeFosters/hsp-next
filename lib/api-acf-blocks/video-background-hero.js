import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const VideoBackgroundHero = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}VideoBackgroundHero {
      backgroundFile {
        mediaItemUrl
      }
      description
      fieldGroupName
      title
      link {
        title
        url
      }
    }
  `;
};
