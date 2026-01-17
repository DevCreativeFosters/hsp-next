import { useMemo } from 'react';

import useGravityForm from '@hooks/useGravityForm';

import Select from '@components/form/select';
import InputWrapper from '@components/gravity-forms/input-wrapper';

export default function SelectField({ field, fieldErrors, form }) {
  const formId = form.databaseId;
  const { dispatch, state } = useGravityForm();
  const options = field.choices.map(({ text, value }) => ({
    label: text,
    // value, // use this to match by unique value
    value: text, // use this to match by label
  }));

  const stateValue = state.find(
    fieldValue => fieldValue.id === field.databaseId,
  )?.value;

  const valueCalculated = stateValue !== undefined ? stateValue : field.value;

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === field.databaseId);
  }, [field.databaseId, fieldErrors]);

  const oneOfValue = field.label === 'Country' ? 2 : 1;

  return (
    <InputWrapper oneOf={oneOfValue}>
      <Select
        errorMessage={fieldError?.message}
        id={`gform_${formId}_${field.databaseId}`}
        label={field.label}
        name={`gform_${formId}_${field.databaseId}`}
        onChange={value => {
          const selectedOption = options.find(o => o.value === value)?.label;
          if (formId == 4 && field.databaseId == 8) {
            dispatch({
              payload: {
                hide: selectedOption == 'My store is not listed' ? false : true,
                id: 9,
                value: '',
              },
              type: 'updateFieldValue',
            });
          }
          dispatch({
            payload: {
              id: field.databaseId,
              value: selectedOption, // use this to match by label
              // value: value, // use this to match by value
            },
            type: 'updateFieldValue',
          });
        }}
        options={options}
        placeholder={field.placeholder}
        required={Boolean(field.isRequired)}
        size="large"
        value={valueCalculated}
      />
    </InputWrapper>
  );
}
