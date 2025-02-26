import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const Reviews = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}Reviews${blockSuffix} {
    fieldGroupName
    inheritFromMainCategory
    title
    titleTag
    titleTagStyle
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
