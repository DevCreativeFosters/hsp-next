import { useMemo } from 'react';
import Radio from '@components/form/radio';
import useGravityForm from '@hooks/useGravityForm';

const DEFAULT_VALUE = '';

export default function TextAreaField({ form, field, fieldErrors }) {
  const { databaseId: id, label, isRequired, choices } = field;
  const { state, dispatch } = useGravityForm();
  const formId = form.formId;
  const fieldValue = state.find(fieldValue => fieldValue.id === id);
  const value = fieldValue?.value || DEFAULT_VALUE;
  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [id, fieldErrors]);

  return (
    <Radio
      id={`gform_${formId}_${id}`}
      name={`gform_${formId}_${id}`}
      label={label}
      value={value}
      options={choices}
      onChange={event => {
        dispatch({
          type: 'updateFieldValue',
          payload: {
            id: id,
            value: event.target.value,
          },
        });
      }}
      required={Boolean(isRequired)}
      errorMessage={fieldError?.message}
    />
  );
}
