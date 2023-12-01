import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const Reviews = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}Reviews {
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
};
