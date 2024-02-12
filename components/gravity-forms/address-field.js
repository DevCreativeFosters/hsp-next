import { useCallback, useEffect, useMemo } from 'react';
import useGravityForm from '@hooks/useGravityForm';
import InputWrapper from '@components/gravity-forms/input-wrapper';
import Select from '@components/form/select';
import {
  initializeState,
  onComplexFieldChange,
} from '@components/gravity-forms/_helpers';
import { COUNTRY_OPTIONS } from '@mockup/countries';
import Input from '@components/form/input';

const DEFAULT_VALUE = '';

export default function AddressField({ form, field, fieldErrors }) {
  const parentKey = 'addressValues';
  const { databaseId: id, isRequired, inputs } = field;
  const formId = form.formId;
  const { state, dispatch } = useGravityForm();

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [id, fieldErrors]);

  const visibleInputs = inputs.filter(({ isHidden }) => !isHidden);

  const onSelectChange = useCallback(value => {}, []);

  useEffect(() => {
    initializeState({
      id,
      visibleInputs,
      parentKey,
      dispatch,
    });
  }, []);

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

      const oneOfValue = ['city', 'state', 'zip', 'country'].includes(childKey)
        ? 2
        : 1;

      const sharedProps = {
        size: 'large',
        id: `gform_${formId}_${inputId}`,
        name: `gform_${formId}_${inputId}`,
        label: customLabel || label,
        placeholder,
        value: valueCalculated,
        errorMessage: fieldError?.message,
        required: Boolean(isRequired),
        ...(field.autocompleteAttribute && {
          autoComplete: field.hasAutocomplete,
        }),
        onChange: valueOrEvent => {
          const newValue =
            typeof valueOrEvent === 'string'
              ? valueOrEvent
              : valueOrEvent.target.value;
          onComplexFieldChange({
            id,
            parentKey,
            childKey,
            value: newValue,
            state,
            dispatch,
          });
        },
      };

      return (
        <InputWrapper oneOf={oneOfValue} key={childKey}>
          {childKey === 'country' ? (
            <Select
              {...sharedProps}
              options={childKey === 'country' ? COUNTRY_OPTIONS : null}
            />
          ) : (
            <Input type="text" {...sharedProps} />
          )}
        </InputWrapper>
      );
    },
  );
}
