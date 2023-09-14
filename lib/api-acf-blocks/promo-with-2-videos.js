import { BLOCK_PREFIX } from './_block-prefix';

export const PromoWith2Videos = `
  ... on ${BLOCK_PREFIX}PromoWith2Videos {
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
      videoUrl
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
