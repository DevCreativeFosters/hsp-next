export const NameInputPropertyFragment = /* GraphQL */ `
  fragment NameInputPropertyFragment on NameInputProperty {
    name
    autocompleteAttribute
    choices {
      isSelected
      text
      value
    }
    customLabel
    defaultValue
    hasChoiceValue
    id
    isHidden
    key
    label
    placeholder
  }
`;
