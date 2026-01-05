import { useEffect, useMemo } from 'react';

import { COUNTRY_OPTIONS } from '@mockup/countries';

import useGravityForm from '@hooks/useGravityForm';

import Input from '@components/form/input';
import Select from '@components/form/select';
import {
  initializeState,
  onComplexFieldChange,
} from '@components/gravity-forms/_helpers';
import InputWrapper from '@components/gravity-forms/input-wrapper';

const DEFAULT_VALUE = '';

export default function AddressField({ field, fieldErrors, form }) {
  const parentKey = 'addressValues';
  const { databaseId: id, inputs, isRequired } = field;
  const formId = form.databaseId;
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
      autocompleteAttribute,
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

      const oneOfValue = ['city', 'state', 'zip', 'country'].includes(childKey)
        ? 2
        : 1;

      const sharedProps = {
        errorMessage: fieldError?.message,
        id: `gform_${formId}_${inputId}`,
        label: customLabel || label,
        name: `gform_${formId}_${inputId}`,
        placeholder,
        required: Boolean(isRequired),
        size: 'large',
        value: valueCalculated,
        ...(field.hasAutocomplete && {
          autoComplete: autocompleteAttribute,
        }),
        onChange: valueOrEvent => {
          const newValue =
            typeof valueOrEvent === 'string'
              ? valueOrEvent
              : valueOrEvent.target.value;
          onComplexFieldChange({
            childKey,
            dispatch,
            id,
            parentKey,
            state,
            value: newValue,
          });
        },
      };

      return (
        <InputWrapper key={childKey} oneOf={oneOfValue}>
          {childKey === 'country' ? (
            <Select {...sharedProps} options={COUNTRY_OPTIONS} />
          ) : (
            <Input type="text" {...sharedProps} />
          )}
        </InputWrapper>
      );
    },
  );
}
