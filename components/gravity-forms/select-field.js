import Select from '@components/form/select';
import InputWrapper from '@components/gravity-forms/input-wrapper';
import useGravityForm from '@hooks/useGravityForm';

function getDefaultValueNormalized(field, options) {
  if (field.defaultValue) {
    const matchedOption = options.find(
      ({ value }) => value === field.defaultValue,
    );
    if (matchedOption) {
      return matchedOption.value;
    }
  }
  return field.placeholder || options[0]?.value;
}

export default function SelectField({ form, field, fieldErrors }) {
  const { formId } = form;
  const { state, dispatch } = useGravityForm();
  const options = field.choices.map(({ text, value }) => ({
    label: text,
    value,
  }));

  const stateValue = state.find(
    fieldValue => fieldValue.id === field.id,
  )?.value;

  const defaultValue = getDefaultValueNormalized(field, options);

  const valueCalculated =
    stateValue !== undefined ? stateValue : field.value || defaultValue;

  return (
    <InputWrapper oneOf={1}>
      <Select
        size="large"
        id={`gform_${formId}_${field.id}`}
        name={`gform_${formId}_${field.id}`}
        label={field.label}
        placeholder={field.placeholder}
        options={options}
        value={valueCalculated}
        onChange={value =>
          dispatch({
            type: 'updateFieldValue',
            payload: {
              id: field.id,
              value,
            },
          })
        }
      />
    </InputWrapper>
  );
}
