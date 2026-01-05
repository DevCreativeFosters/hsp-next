import { useMemo } from 'react';

import useGravityForm from '@hooks/useGravityForm';

import Radio from '@components/form/radio';

const DEFAULT_VALUE = '';

export default function RadioField({ field, fieldErrors, form }) {
  const { choices, databaseId: id, isRequired, label } = field;
  const { dispatch, state } = useGravityForm();
  const formId = form.databaseId;
  const fieldValue = state.find(fieldValue => fieldValue.id === id);
  const value = fieldValue?.value || DEFAULT_VALUE;
  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [fieldErrors, id]);

  return (
    <Radio
      errorMessage={fieldError?.message}
      id={`gform_${formId}_${id}`}
      label={label}
      name={`gform_${formId}_${id}`}
      onChange={event => {
        dispatch({
          payload: {
            id: id,
            value: event.target.value,
          },
          type: 'updateFieldValue',
        });
      }}
      options={choices}
      required={Boolean(isRequired)}
      value={value}
    />
  );
}
