import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const LinksInGroups = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}LinksInGroups {
      fieldGroupName
      title
      description
      groups {
        title
        links {
          link {
            title
            url
            target
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
