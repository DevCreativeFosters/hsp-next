import Input from '@components/form/input';
import InputWrapper from '@components/gravity-forms/input-wrapper';
import useGravityForm from '@hooks/useGravityForm';
import styles from './date-field.module.scss';

const DEFAULT_VALUE = '';

export default function DateField({
  form,
  field,
  fieldErrors,
  min = '1990-01-01',
  max = new Date().toISOString().split('T')[0],
}) {
  const { formId } = form;
  const { id, value, label, placeholder } = field;
  const { state, dispatch } = useGravityForm();

  const stateValue = state.find(fieldValue => fieldValue.id === id)?.value;
  const valueCalculated =
    stateValue !== undefined ? stateValue : value || DEFAULT_VALUE;

  return (
    <InputWrapper oneOf={2}>
      <Input
        className={styles.dateInput}
        type="date"
        size="large"
        id={`gform_${formId}_${id}`}
        name={`gform_${formId}_${id}`}
        label={label}
        placeholder={placeholder}
        value={valueCalculated}
        min={min}
        max={max}
        onChange={ev =>
          dispatch({
            type: 'updateFieldValue',
            payload: {
              id,
              value: ev.target.value,
            },
          })
        }
      />
    </InputWrapper>
  );
}
