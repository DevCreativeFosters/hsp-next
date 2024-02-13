export const SelectFieldFragment = /* GraphQL */ `
  fragment SelectFieldFragment on SelectField {
    id
    adminLabel
    autocompleteAttribute
    canPrepopulate
    choices {
      text
      value
    }
    #    cssClass
    databaseId
    defaultValue
    description
    #    descriptionPlacement
    #    displayOnly
    errorMessage
    hasAutocomplete
    hasChoiceValue
    hasEnhancedUI
    inputName
    inputType
    inputs {
      id
      label
    }
    isRequired
    label
    #    labelPlacement
    layoutGridColumnSpan
    #    layoutSpacerGridColumnSpan
    #    pageNumber
    placeholder
    #    shouldAllowDuplicates
    size
    type
    value
    visibility
  }
`;
