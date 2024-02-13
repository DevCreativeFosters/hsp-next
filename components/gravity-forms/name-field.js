'use client';

import InputWrapper from '@components/gravity-forms/input-wrapper';
import { useEffect, useMemo } from 'react';
import Input from '@components/form/input';
import useGravityForm from '@hooks/useGravityForm';
import { initializeState, onComplexFieldChange } from './_helpers';

const DEFAULT_VALUE = '';

export default function NameField({ form, field, fieldErrors }) {
  const parentKey = 'nameValues';
  const { databaseId: id, isRequired, inputs } = field;

  const formId = form.formId;
  const { state, dispatch } = useGravityForm();

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [id, fieldErrors]);

  const visibleInputs = inputs.filter(({ isHidden }) => !isHidden);

  useEffect(
    function syncFieldState() {
      initializeState({
        id,
        visibleInputs,
        parentKey,
        dispatch,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return visibleInputs.map(
    ({
      id: inputId,
      key: childKey,
      label,
      customLabel,
      placeholder,
      value,
    }) => {
      const stateValue = state.find(fieldValue => fieldValue.id === id)?.[
        parentKey
      ][childKey];
      const valueCalculated =
        stateValue !== undefined ? stateValue : value || DEFAULT_VALUE;

      return (
        <InputWrapper oneOf={visibleInputs.length} key={inputId}>
          <Input
            type="text"
            id={`gform_${formId}_${inputId}`}
            name={`gform_${formId}_${inputId}`}
            autoComplete={
              field.hasAutocomplete ? field.autocompleteAttribute : null
            }
            label={customLabel || label}
            placeholder={placeholder}
            errorMessage={fieldError?.message}
            required={Boolean(isRequired)}
            value={valueCalculated}
            onChange={ev => {
              onComplexFieldChange({
                id,
                parentKey,
                childKey,
                value: ev.target.value,
                state,
                dispatch,
              });
            }}
          />
        </InputWrapper>
      );
    },
  );
}
