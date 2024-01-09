import { useEffect } from 'react';
import useGravityForm from '@hooks/useGravityForm';

const DEFAULT_VALUE = '';

export default function HiddenInputField({ form, field, hiddenInputs }) {
  const { databaseId: id, inputName } = field;
  const { state, dispatch } = useGravityForm();
  const formId = form.formId;
  const fieldValue = state.find(fieldValue => fieldValue.id === id);
  const value = fieldValue?.value || DEFAULT_VALUE;

  useEffect(
    function prepopulateInput() {
      hiddenInputs.map(hiddenInput => {
        if (hiddenInput.inputName === inputName) {
          dispatch({
            type: 'updateFieldValue',
            payload: {
              id: id,
              value: hiddenInput.value,
            },
          });
        }
      });
    },
    [hiddenInputs, id, inputName, dispatch],
  );

  return (
    <input
      type="hidden"
      id={`gform_${formId}_${id}`}
      name={`gform_${formId}_${id}`}
      value={value}
    />
  );
}
