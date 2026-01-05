import { useEffect } from 'react';

import useGravityForm from '@hooks/useGravityForm';

const DEFAULT_VALUE = '';

export default function HiddenInputField({ field, form, hiddenInputs }) {
  const { databaseId: id, inputName } = field;
  const { dispatch, state } = useGravityForm();
  const formId = form.databaseId;
  const fieldValue = state.find(fieldValue => fieldValue.id === id);
  const value = fieldValue?.value || DEFAULT_VALUE;

  useEffect(
    function prepopulateInput() {
      hiddenInputs.map(hiddenInput => {
        if (hiddenInput.inputName === inputName) {
          dispatch({
            payload: {
              id: id,
              value: hiddenInput.value,
            },
            type: 'updateFieldValue',
          });
        }
      });
    },
    [dispatch, hiddenInputs, id, inputName],
  );

  return (
    <input
      id={`gform_${formId}_${id}`}
      name={`gform_${formId}_${id}`}
      type="hidden"
      value={value}
    />
  );
}
