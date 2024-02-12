import { fetchAPI } from '@lib/api';

export async function sendGravityForm(input) {
  const data = await fetchAPI(
    `
      mutation ($input: SubmitGfFormInput!) {
        submitGfForm(input: $input) {
          confirmation {
            type
            message
            url
          }
          errors {
            id
            message
          }
        }
      }
    `,
    {
      variables: {
        input: input,
      },
    },
  );

  return data;
}
