import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const Accreditations = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}Accreditations {
      fieldGroupName
      title
      text
      certificates {
        certificateName
        image {
          altText
          sourceUrl
        }
      }
      membershipsGroup {
        text
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
