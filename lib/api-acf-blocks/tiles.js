import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const Tiles = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}Tiles {
      fieldGroupName
      title
      description
      buttons {
        label
        variant
        link {
          url
        }
        withArrowForwardIcon
      }
      tiles {
        image {
          sourceUrl
          altText,
          mediaDetails {
            width
            height
          }
        }
        title
        content
        link {
          url
          target
        }
        tags {
          name
          link
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
