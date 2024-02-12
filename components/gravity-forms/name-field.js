import InputWrapper from '@components/gravity-forms/input-wrapper';
import { useMemo } from 'react';
import Input from '@components/form/input';
import useGravityForm from '@hooks/useGravityForm';

const DEFAULT_VALUE = '';

export default function NameField({ form, field, fieldErrors }) {
  const { databaseId: id, isRequired, inputs } = field;
  const formId = form.formId;
  const { state, dispatch } = useGravityForm();

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [id, fieldErrors]);

  const visibleInputs = inputs.filter(({ isHidden }) => !isHidden);
  return visibleInputs.map(({ id, label, customLabel, placeholder, value }) => {
    const stateValue = state.find(fieldValue => fieldValue.id === id)?.value;

    const valueCalculated =
      stateValue !== undefined ? stateValue : value || DEFAULT_VALUE;

    return (
      <InputWrapper oneOf={visibleInputs.length} key={id}>
        <Input
          type="text"
          id={`gform_${formId}_${id}`}
          name={`gform_${formId}_${id}`}
          autoComplete={
            field.hasAutocomplete ? field.autocompleteAttribute : null
          }
          label={customLabel || label}
          placeholder={placeholder}
          errorMessage={fieldError?.message}
          required={Boolean(isRequired)}
          value={valueCalculated}
          onChange={ev => {
            dispatch({
              type: 'updateFieldValue',
              payload: {
                id,
                value: ev.target.value,
              },
            });
          }}
        />
      </InputWrapper>
    );
  });
}
