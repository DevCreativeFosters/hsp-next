import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const TitleAndDescription = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}TitleAndDescription {
      fieldGroupName
      title
      description
      background {
        colorStop {
          color
          position
        }
      }
    }
  `;
};
