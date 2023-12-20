import { useMemo } from 'react';
import Input from '@components/form/input';
import useGravityForm from '@hooks/useGravityForm';

const DEFAULT_VALUE = '';

function getPayload(type, id, value) {
  switch (type) {
    case 'EMAIL':
      return {
        id: id,
        emailValues: {
          value: value,
        },
      };
    default:
      return {
        id: id,
        value: value,
      };
  }
}

function getType(type) {
  switch (type) {
    case 'PHONE':
      return 'tel';
    case 'EMAIL':
      return 'email';
    default:
      return 'text';
  }
}

function getValue(type, fieldValue) {
  switch (type) {
    case 'EMAIL':
      return fieldValue?.emailValues?.value;
    default:
      return fieldValue?.value;
  }
}

export default function InputField({ form, field, fieldErrors }) {
  const {
    databaseId: id,
    type,
    label,
    layoutGridColumnSpan,
    isRequired,
    placeholder,
  } = field;
  const formId = form.formId;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(fieldValue => fieldValue.id === id);
  const value = getValue(type, fieldValue) || DEFAULT_VALUE;
  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [id, fieldErrors]);

  return (
    <Input
      id={`gform_${formId}_${id}`}
      type={getType(type)}
      name={`gform_${formId}_${id}`}
      placeholder={placeholder}
      errorMessage={fieldError?.message}
      halfWidth={layoutGridColumnSpan === 6}
      label={label}
      required={Boolean(isRequired)}
      value={value}
      onChange={ev => {
        dispatch({
          type: 'updateFieldValue',
          payload: getPayload(type, id, ev.target.value),
        });
      }}
    />
  );
}
