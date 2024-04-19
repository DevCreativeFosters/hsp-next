import { useMemo } from 'react';

import useGravityForm from '@hooks/useGravityForm';

import Select from '@components/form/select';
import InputWrapper from '@components/gravity-forms/input-wrapper';

export default function SelectField({ field, fieldErrors, form }) {
  const { formId } = form;
  const { dispatch, state } = useGravityForm();
  const options = field.choices.map(({ text, value }) => ({
    label: text,
    // value, // use this to match by unique value
    value: text, // use this to match by label
  }));

  const stateValue = state.find(
    fieldValue => fieldValue.id === field.id,
  )?.value;

  const valueCalculated = stateValue !== undefined ? stateValue : field.value;

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === field.id);
  }, [field.id, fieldErrors]);

  return (
    <InputWrapper oneOf={1}>
      <Select
        errorMessage={fieldError?.message}
        id={`gform_${formId}_${field.id}`}
        label={field.label}
        name={`gform_${formId}_${field.id}`}
        onChange={value =>
          dispatch({
            payload: {
              id: field.id,
              value: options.find(o => o.value === value)?.label, // use this to match by label
              // value: value, // use this to match by value
            },
            type: 'updateFieldValue',
          })
        }
        options={options}
        placeholder={field.placeholder}
        required={Boolean(field.isRequired)}
        size="large"
        value={valueCalculated}
      />
    </InputWrapper>
  );
}
