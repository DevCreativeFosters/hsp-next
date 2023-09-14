import { BLOCK_PREFIX } from '@lib/api-acf-blocks/_block-prefix';

export const Faq = `
  ... on ${BLOCK_PREFIX}Faq {
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
    background {
      colorStop {
        color
        position
      }
    }
    questions {
      answer
      question
    }
  }
`;
