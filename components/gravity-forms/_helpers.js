export function initializeState({ dispatch, id, parentKey, visibleInputs }) {
  const updatedDataModel = {};
  visibleInputs.forEach(({ key, value }) => {
    updatedDataModel[key] = value;
  });

  dispatch({
    payload: {
      id,
      [parentKey]: updatedDataModel,
    },
    type: 'updateFieldValue',
  });
}

export function onComplexFieldChange({
  childKey,
  dispatch,
  id,
  parentKey,
  state,
  value,
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
    payload: {
      id,
      [parentKey]: updatedDataModel,
    },
    type: 'updateFieldValue',
  });
}
