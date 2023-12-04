import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const InformationCards = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}InformationCards {
      fieldGroupName
      cards {
        size
        icon {
          altText
          sourceUrl
        }
        title
        gap
        description
        backgroundImage {
          sourceUrl
          altText
          mediaDetails {
            height
            width
          }
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
