'use client';

import { useCallback, useState, useEffect, forwardRef } from 'react';
import GForm from './gform';
import { getGravityForm } from '@lib/api';
import { GravityFormProvider } from '@contexts/gravity-form';
import Loading from '@components/loading/loading';

function GravityFormWrapperWithRef(
  {
    attributes,
    hiddenInputs = [],
    submitButton = true,
    preventConfirmation,
    onChange = () => null,
    onReset = () => null,
    onSubmit = () => null,
    onSuccess = () => null,
    onLoad = () => null,
    onError = () => null,
  },
  ref,
) {
  const [gfForm, setGfForm] = useState(null);

  const fetchGfForm = useCallback(async () => {
    if (attributes.id) {
      const form = await getGravityForm(attributes.id);

      setGfForm(form.gfForm);
    }
  }, [attributes.id]);

  useEffect(() => {
    if (gfForm) {
      onLoad();
    }
  }, [gfForm, onLoad]);

  useEffect(() => {
    fetchGfForm();
  }, [fetchGfForm]);

  if (!gfForm) return <Loading color="white" size="large" />;

  return (
    <GravityFormProvider>
      <GForm
        innerRef={ref}
        form={gfForm}
        hiddenInputs={hiddenInputs}
        onChange={onChange}
        onReset={onReset}
        onSubmit={onSubmit}
        onSuccess={onSuccess}
        onError={onError}
        submitButton={submitButton}
        attributes={attributes}
        preventConfirmation={preventConfirmation}
      />
    </GravityFormProvider>
  );
}

export default forwardRef(GravityFormWrapperWithRef);
