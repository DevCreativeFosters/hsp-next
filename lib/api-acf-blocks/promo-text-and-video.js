import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const PromoTextAndVideo = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}PromoTextAndVideo {
      fieldGroupName
      title
      description
      learnMoreButton {
        title
        url
      }
      videoFile {
        mediaItemUrl
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
