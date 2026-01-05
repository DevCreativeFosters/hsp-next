import { useMemo } from 'react';

import useGravityForm from '@hooks/useGravityForm';

import Input from '@components/form/input';
import InputWrapper from '@components/gravity-forms/input-wrapper';

import styles from './date-field.module.scss';

const DEFAULT_VALUE = '';

export default function DateField({
  field,
  fieldErrors,
  form,
  max = new Date().toISOString().split('T')[0],
  min = '1990-01-01',
}) {
  const formId = form.databaseId;
  const { databaseId, isRequired, label, placeholder, value } = field;
  const { dispatch, state } = useGravityForm();

  const stateValue = state.find(
    fieldValue => fieldValue.id === databaseId,
  )?.value;
  const valueCalculated =
    stateValue !== undefined ? stateValue : value || DEFAULT_VALUE;

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === databaseId);
  }, [databaseId, fieldErrors]);

  return (
    <InputWrapper oneOf={2}>
      <Input
        className={styles.dateInput}
        errorMessage={fieldError?.message}
        id={`gform_${formId}_${databaseId}`}
        label={label}
        max={max}
        min={min}
        name={`gform_${formId}_${databaseId}`}
        onChange={ev =>
          dispatch({
            payload: {
              id: databaseId,
              value: ev.target.value,
            },
            type: 'updateFieldValue',
          })
        }
        placeholder={placeholder}
        required={Boolean(isRequired)}
        size="large"
        type="date"
        value={valueCalculated}
      />
    </InputWrapper>
  );
}
