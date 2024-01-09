'use client';

import { useCallback, useState, useEffect, forwardRef } from 'react';
import GForm from './gform';
import { getGravityForm } from '@lib/api';
import { GravityFormProvider } from '@contexts/gravity-form';
import Loading from '@components/loading/loading';

function GravityFormWithRef(
  {
    attributes,
    hiddenInputs,
    submitButton = true,
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
        onReset={onReset}
        onSubmit={onSubmit}
        onSuccess={onSuccess}
        onError={onError}
        submitButton={submitButton}
        attributes={attributes}
      />
    </GravityFormProvider>
  );
}

export default forwardRef(GravityFormWithRef);
