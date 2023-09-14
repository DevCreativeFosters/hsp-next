import { BLOCK_PREFIX } from './_block-prefix';

export const Reviews = `
  ... on ${BLOCK_PREFIX}Reviews {
    fieldGroupName
    title
    description
    allReviewsLink {
      link {
        title
        url
      }
    }
    reviews {
      score
      reviewText
      reviewerName
    }
    background {
      colorStop {
        color
        position
      }
    }
  }
`;
