export const TextFieldFragment = /* GraphQL */ `
  fragment TextFieldFragment on TextField {
    adminLabel
    autocompleteAttribute
    canPrepopulate
    conditionalLogic {
      actionType
      logicType
      rules {
        fieldId
        operator
        value
      }
    }
    cssClass
    databaseId
    defaultValue
    description
    descriptionPlacement
    displayOnly
    errorMessage
    hasAutocomplete
    hasInputMask
    inputMaskValue
    inputName
    inputType
    isPasswordInput
    isRequired
    label
    labelPlacement
    layoutGridColumnSpan
    layoutSpacerGridColumnSpan
    maxLength
    pageNumber
    personalData {
      isIdentificationField
      shouldErase
      shouldExport
    }
    placeholder
    shouldAllowDuplicates
    size
    type
    value
    visibility
  }
`;
