import { NameInputPropertyFragment } from '@lib/api/gf-fragments/name-input-property';

export const NameFieldFragment = /* GraphQL */ `
  ${NameInputPropertyFragment}
  fragment NameFieldFragment on NameField {
    id
    #    adminLabel
    canPrepopulate
    #    cssClass
    databaseId
    description
    #    descriptionPlacement
    inputName
    inputType
    inputs {
      id
      label
      ...NameInputPropertyFragment
    }
    isRequired
  }
`;
