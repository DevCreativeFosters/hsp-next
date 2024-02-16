import { useEffect, useMemo } from 'react';
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
    value,
  } = field;

  const formId = form.formId;
  const { state, dispatch } = useGravityForm();
  const fieldValue = state.find(fieldValue => fieldValue.id === id);

  const stateValue = getValue(type, fieldValue);
  const valueCalculated =
    stateValue !== undefined ? stateValue : value || DEFAULT_VALUE;

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [id, fieldErrors]);

  useEffect(
    function syncFieldState() {
      if (valueCalculated) {
        dispatch({
          type: 'updateFieldValue',
          payload: getPayload(type, id, valueCalculated),
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Input
      type={getType(type)}
      id={`gform_${formId}_${id}`}
      name={`gform_${formId}_${id}`}
      autoComplete={field.hasAutocomplete ? field.autocompleteAttribute : null}
      placeholder={placeholder}
      errorMessage={fieldError?.message}
      halfWidth={layoutGridColumnSpan === 6}
      label={label}
      required={Boolean(isRequired)}
      value={valueCalculated}
      onChange={ev => {
        dispatch({
          type: 'updateFieldValue',
          payload: getPayload(type, id, ev.target.value),
        });
      }}
    />
  );
}
