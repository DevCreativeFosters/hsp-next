import {
  blockPrefix,
  blockSuffix,
} from '@lib/api-acf-blocks/_block-name-helper';

export const Faq = () => {
  return /* GraphQL */ `
    ... on ${blockPrefix}Faq${blockSuffix} {
      fieldGroupName
      title
      titleTag
      titleTagStyle
      description
      buttons {
        label
        variant
        link {
          url
        }
        withArrowForwardIcon
      }
      questions {
        answer
        question
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
