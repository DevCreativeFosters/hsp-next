'use client';

import { createContext, useReducer } from 'react';

export const GravityFormContext = createContext(null);

function reducer(state, action) {
  const currentFieldId = action.payload?.id;
  const stateWithoutCurrentField = state.filter(
    field => field.id !== currentFieldId,
  );

  switch (action.type) {
    case 'resetFieldValues': {
      return [];
    }
    case 'updateFieldValue': {
      return [...stateWithoutCurrentField, ...[action.payload]];
    }
    default:
      throw new Error(`Action not supported: ${action.type}.`);
  }
}

export function GravityFormProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, []);

  return (
    <GravityFormContext.Provider value={{ state, dispatch }}>
      {children}
    </GravityFormContext.Provider>
  );
}
