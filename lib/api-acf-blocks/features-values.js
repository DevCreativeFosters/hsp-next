import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const FeaturesValues = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}FeaturesValues${blockSuffix} {
      fieldGroupName
      sectionTitle
      titleTag
      titleTagStyle
      description
      videoFile {
        node {
          mediaItemUrl
        }
      }
      videoThumbnailImage {
        node {
          sourceUrl
        }
      }
      buttonLink {
        title
        url
      }
      attributes {
        description
        title
        titleTag
        titleTagStyle
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
