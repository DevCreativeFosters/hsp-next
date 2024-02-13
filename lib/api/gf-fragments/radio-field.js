export const RadioFieldFragment = /* GraphQL */ `
  fragment RadioFieldFragment on RadioField {
    databaseId
    choices {
      text
      value
    }
    cssClass
    isRequired
    label
  }
`;
