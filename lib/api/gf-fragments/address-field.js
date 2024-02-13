import { AddressInputPropertyFragment } from '@lib/api/gf-fragments/address-input-property';

export const AddressFieldFragment = /* GraphQL */ `
  ${AddressInputPropertyFragment}
  fragment AddressFieldFragment on AddressField {
    id
    #    addressType
    addressValues {
      city
      country
      lineTwo
      state
      street
      zip
    }
    #    adminLabel
    canPrepopulate
    #    copyValuesOptionFieldId
    #    copyValuesOptionLabel
    #    cssClass
    databaseId
    #    defaultCountry
    #    defaultProvince
    #    defaultState
    #    description
    #    descriptionPlacement
    #    displayOnly
    #    errorMessage
    hasAutocomplete
    inputName
    inputType
    isRequired
    label
    #    labelPlacement
    layoutGridColumnSpan
    layoutSpacerGridColumnSpan
    #    pageNumber
    #    shouldCopyValuesOption
    #    subLabelPlacement
    type
    value
    visibility
    inputs {
      id
      label
      ...AddressInputPropertyFragment
    }
  }
`;
