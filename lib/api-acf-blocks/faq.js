import { getBlockPrefix } from '@lib/api-acf-blocks/_block-prefix';

export const Faq = prefixType => {
  const prefix = getBlockPrefix(prefixType);

  return `
    ... on ${prefix}Faq {
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
