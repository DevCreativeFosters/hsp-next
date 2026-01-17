import { useMemo } from 'react';

import useGravityForm from '@hooks/useGravityForm';

import Textarea from '@components/form/textarea';

const DEFAULT_VALUE = '';

export default function TextAreaField({ field, fieldErrors, form }) {
  const { databaseId: id, isRequired, label, placeholder } = field;
  const { dispatch, state } = useGravityForm();
  const formId = form.databaseId;
  const fieldValue = state.find(fieldValue => fieldValue.id === id);
  const value = fieldValue?.value || DEFAULT_VALUE;
  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [fieldErrors, id]);

  if (fieldValue?.hide) return null;

  return (
    <Textarea
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
      placeholder={placeholder}
      required={Boolean(isRequired)}
      value={value}
    />
  );
}
