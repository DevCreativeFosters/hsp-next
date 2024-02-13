import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const PromoWith2Videos = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}PromoWith2Videos {
      fieldGroupName
      sectionTitle
      description
      buttonLink {
        title
        url
      }
      accessories {
        accessoryName
        price
        videoFile {
          mediaItemUrl
        }
        productLink {
          url
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
