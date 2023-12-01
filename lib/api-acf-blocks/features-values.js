import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const FeaturesValues = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}FeaturesValues {
      fieldGroupName
      sectionTitle
      description
      videoUrl
      videoThumbnailImage {
        sourceUrl
      }
      buttonLink {
        title
        url
      }
      attributes {
        description
        title
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
