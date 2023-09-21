import { useMemo } from 'react';
import Textarea from '@components/form/textarea';
import useGravityForm from '@hooks/useGravityForm';

const DEFAULT_VALUE = '';

export default function TextAreaField({ form, field, fieldErrors }) {
  const { id, label, isRequired, placeholder } = field;
  const { state, dispatch } = useGravityForm();
  const formId = form.formId;
  const fieldValue = state.find(fieldValue => fieldValue.id === id);
  const value = fieldValue?.value || DEFAULT_VALUE;
  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [id, fieldErrors]);

  return (
    <Textarea
      id={`gform_${formId}_${id}`}
      name={`gform_${formId}_${id}`}
      placeholder={placeholder}
      errorMessage={fieldError?.message}
      label={label}
      required={Boolean(isRequired)}
      value={value}
      onChange={event => {
        dispatch({
          type: 'updateFieldValue',
          payload: {
            id: id,
            value: event.target.value,
          },
        });
      }}
    />
  );
}
