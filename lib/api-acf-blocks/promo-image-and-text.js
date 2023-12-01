import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const PromoImageAndText = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}PromoImageAndText {
      fieldGroupName
      title
      description
      image {
        altText
        sourceUrl
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
