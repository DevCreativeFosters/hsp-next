import Select from '@components/form/select';
import { useMemo } from 'react';
import useGravityForm from '@hooks/useGravityForm';
import Input from '@components/form/input';
import CustomSelect from '@components/custom-select/custom-select';
import InputWrapper from './input-wrapper';

const DEFAULT_VALUE = '';

export default function AddressField({ form, field, fieldErrors }) {
  const { databaseId: id, isRequired, inputs } = field;
  const formId = form.formId;
  const { state, dispatch } = useGravityForm();

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [id, fieldErrors]);

  const visibleInputs = inputs.filter(({ isHidden }) => !isHidden);

  return visibleInputs.map(
    ({ id, key, label, customLabel, placeholder, value }) => {
      const stateValue = state.find(fieldValue => fieldValue.id === id)?.value;
      const valueCalculated =
        stateValue !== undefined ? stateValue : value || DEFAULT_VALUE;

      const oneOfValue = ['city', 'state', 'zip', 'country'].includes(key)
        ? 2
        : 1;

      const countryOptions = [
        {
          label: 'Australia',
          value: 'AU',
        },
        {
          label: 'Thailand',
          value: 'TH',
        },
        {
          label: 'New Zeland',
          value: 'NZ',
        },
      ];

      const sharedProps = {
        id: `gform_${formId}_${id}`,
        name: `gform_${formId}_${id}`,
        label: customLabel || label,
        placeholder,
        value: valueCalculated,
        errorMessage: fieldError?.message,
        required: Boolean(isRequired),
        ...(field.autocompleteAttribute && {
          autoComplete: field.hasAutocomplete,
        }),
      };

      const inputProps = {
        onChange: ev => {
          dispatch({
            type: 'updateFieldValue',
            payload: {
              id,
              value: ev.target.value,
            },
          });
        },
      };

      const selectProps = {
        options: key === 'country' ? countryOptions : null,
        onChange: value =>
          dispatch({
            type: 'updateFieldValue',
            payload: {
              id,
              value,
            },
          }),
      };

      return (
        <InputWrapper oneOf={oneOfValue} key={id}>
          {key === 'country' ? (
            <Select size="large" {...sharedProps} {...selectProps} />
          ) : (
            <Input type="text" {...sharedProps} {...inputProps} />
          )}
        </InputWrapper>
      );
    },
  );
}
