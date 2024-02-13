export function initializeState({ id, visibleInputs, parentKey, dispatch }) {
  const updatedDataModel = {};
  visibleInputs.forEach(({ key, value }) => {
    updatedDataModel[key] = value;
  });

  dispatch({
    type: 'updateFieldValue',
    payload: {
      id,
      [parentKey]: updatedDataModel,
    },
  });
}

export function onComplexFieldChange({
  id,
  parentKey,
  childKey,
  value,
  state,
  dispatch,
}) {
  const stateObject = state.find(fieldValue => fieldValue.id === id)?.[
    parentKey
  ];
  if (!stateObject) return false;
  const updatedDataModel = {};
  const entries = Object.entries(stateObject);
  entries.forEach(([entryKey, entryValue]) => {
    updatedDataModel[entryKey] = entryKey === childKey ? value : entryValue;
  });

  dispatch({
    type: 'updateFieldValue',
    payload: {
      id,
      [parentKey]: updatedDataModel,
    },
  });
}
