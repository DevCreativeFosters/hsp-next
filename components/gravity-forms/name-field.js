'use client';

import { useEffect, useMemo } from 'react';

import useGravityForm from '@hooks/useGravityForm';

import Input from '@components/form/input';
import InputWrapper from '@components/gravity-forms/input-wrapper';

import { initializeState, onComplexFieldChange } from './_helpers';

const DEFAULT_VALUE = '';

export default function NameField({ field, fieldErrors, form }) {
  const parentKey = 'nameValues';
  const { databaseId: id, inputs, isRequired } = field;

  const formId = form.formId;
  const { dispatch, state } = useGravityForm();

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [fieldErrors, id]);

  const visibleInputs = inputs.filter(({ isHidden }) => !isHidden);

  useEffect(
    function syncFieldState() {
      initializeState({
        dispatch,
        id,
        parentKey,
        visibleInputs,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return visibleInputs.map(
    ({
      customLabel,
      id: inputId,
      key: childKey,
      label,
      placeholder,
      value,
    }) => {
      const stateValue = state.find(fieldValue => fieldValue.id === id)?.[
        parentKey
      ][childKey];
      const valueCalculated =
        stateValue !== undefined ? stateValue : value || DEFAULT_VALUE;

      return (
        <InputWrapper key={inputId} oneOf={visibleInputs.length}>
          <Input
            autoComplete={
              field.hasAutocomplete ? field.autocompleteAttribute : null
            }
            errorMessage={fieldError?.message}
            id={`gform_${formId}_${inputId}`}
            label={customLabel || label}
            name={`gform_${formId}_${inputId}`}
            onChange={ev => {
              onComplexFieldChange({
                childKey,
                dispatch,
                id,
                parentKey,
                state,
                value: ev.target.value,
              });
            }}
            placeholder={placeholder}
            required={Boolean(isRequired)}
            type="text"
            value={valueCalculated}
          />
        </InputWrapper>
      );
    },
  );
}
