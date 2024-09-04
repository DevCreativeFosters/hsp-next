import { useEffect, useMemo } from 'react';

import useGravityForm from '@hooks/useGravityForm';

import Input from '@components/form/input';

const DEFAULT_VALUE = '';

function getPayload(type, id, value) {
  switch (type) {
    case 'EMAIL':
      return {
        emailValues: {
          value: value,
        },
        id: id,
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

export default function InputField({ field, fieldErrors, form }) {
  const {
    databaseId: id,
    defaultValue,
    isRequired,
    label,
    layoutGridColumnSpan,
    placeholder,
    type,
    value,
  } = field;

  const formId = form.formId;
  const { dispatch, state } = useGravityForm();
  const fieldValue = state.find(fieldValue => fieldValue.id === id);

  const stateValue = getValue(type, fieldValue);
  const valueCalculated =
    stateValue !== undefined
      ? stateValue
      : value || defaultValue || DEFAULT_VALUE;

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [fieldErrors, id]);

  useEffect(
    function syncFieldState() {
      if (valueCalculated) {
        dispatch({
          payload: getPayload(type, id, valueCalculated),
          type: 'updateFieldValue',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Input
      autoComplete={field.hasAutocomplete ? field.autocompleteAttribute : null}
      errorMessage={fieldError?.message}
      halfWidth={layoutGridColumnSpan === 6}
      id={`gform_${formId}_${id}`}
      label={label}
      name={`gform_${formId}_${id}`}
      onChange={ev => {
        dispatch({
          payload: getPayload(type, id, ev.target.value),
          type: 'updateFieldValue',
        });
      }}
      placeholder={placeholder}
      required={Boolean(isRequired)}
      type={getType(type)}
      value={valueCalculated}
    />
  );
}
