'use client';

import { useCallback, useState } from 'react';
import Button from '@components/button/button';
import Form from '@components/form/form';
import useGravityForm from '@hooks/useGravityForm';
import { sendGravityForm } from '@lib/api';
import GravityFormsField from './fields';
import Confirmation from './confirmation';
import Loading from '@components/loading/loading';

export default function GForm({ form }) {
  const [isLoading, setLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const formFields = form.formFields?.nodes || [];
  const { state, dispatch } = useGravityForm();

  const resetForm = useCallback(() => {
    dispatch({
      type: 'resetFieldValues',
    });
    setLoading(false);
    setSubmitted(false);
    setFieldErrors([]);
    setConfirmation(null);
  }, []);

  const handleSubmit = async ev => {
    ev.preventDefault();
    if (isLoading) return;

    setLoading(true);
    await sendGravityForm({
      id: form.formId,
      fieldValues: state,
    })
      .then(response => {
        const gfFormConfirmation = response.submitGfForm.confirmation;
        const errors = response.submitGfForm.errors;

        if (!errors?.length) {
          setSubmitted(true);
          setConfirmation(gfFormConfirmation);
          setLoading(false);
        } else {
          setFieldErrors(errors);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Form method="post" onSubmit={handleSubmit} withPadding withBackground>
      {isSubmitted ? (
        <Confirmation resetForm={resetForm} content={confirmation.message} />
      ) : (
        <>
          {form.title && <h3>{form.title}</h3>}
          {form.description && <p>{form.description}</p>}
          {formFields.map(field => (
            <GravityFormsField
              key={field?.id}
              form={form}
              field={field}
              fieldErrors={fieldErrors}
            />
          ))}
          <Button
            type="submit"
            disabled={isLoading}
            rightIcon={isLoading ? null : 'send'}
          >
            {form?.button?.text || 'Submit'} {isLoading && <Loading />}
          </Button>
        </>
      )}
    </Form>
  );
}
