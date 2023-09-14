import { BLOCK_PREFIX } from './_block-prefix';

export const FeaturesValues = `
  ... on ${BLOCK_PREFIX}FeaturesValues {
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
