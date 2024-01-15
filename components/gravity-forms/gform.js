'use client';

import { useCallback, useImperativeHandle, useRef, useState } from 'react';
import Button from '@components/button/button';
import Form from '@components/form/form';
import Loading from '@components/loading/loading';
import GravityFormsField from './fields';
import Confirmation from './confirmation';
import useGravityForm from '@hooks/useGravityForm';
import { sendGravityForm } from '@lib/api';
import styles from './gform.module.scss';

export default function GForm({
  innerRef,
  form,
  hiddenInputs,
  attributes = {},
  submitButton,
  preventConfirmation,
  onChange,
  onReset,
  onError,
  onSubmit,
  onSuccess,
}) {
  const [isLoading, setLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);
  const formFields = form.formFields?.nodes || [];
  const { state, dispatch } = useGravityForm();
  const submitRef = useRef(null);

  const resetForm = useCallback(() => {
    dispatch({
      type: 'resetFieldValues',
    });
    onReset();
    setLoading(false);
    setSubmitted(false);
    setFieldErrors([]);
    setConfirmation(null);
  }, [dispatch, onReset]);

  const handleSubmit = async ev => {
    if (ev) ev.preventDefault();
    if (isLoading) return;

    setLoading(true);
    onSubmit();
    await sendGravityForm({
      id: form.formId,
      fieldValues: state,
    })
      .then(response => {
        const gfFormConfirmation = response.submitGfForm.confirmation;
        const errors = response.submitGfForm.errors;

        if (!errors?.length) {
          onSuccess();
          setSubmitted(true);
          setConfirmation(gfFormConfirmation);
          setLoading(false);
        } else {
          onError();
          setFieldErrors(errors);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  useImperativeHandle(
    innerRef,
    () => {
      return {
        handleSubmit: () => {
          if (submitRef.current) {
            submitRef.current.click();
          }
        },
      };
    },
    [],
  );

  const isTitleVisible = attributes.title && form.title;

  return (
    <Form
      method="post"
      onSubmit={handleSubmit}
      withPadding={attributes.withPadding}
      withBackground={attributes.withBackground}
      onChange={onChange}
    >
      {isSubmitted && !preventConfirmation ? (
        <Confirmation resetForm={resetForm} content={confirmation.message} />
      ) : (
        <>
          {(isTitleVisible || form.description) && (
            <div className={styles.formDescription}>
              {isTitleVisible && <h3>{form.title}</h3>}
              {form.description && <p>{form.description}</p>}
            </div>
          )}

          {formFields.map((field, index) => (
            <GravityFormsField
              key={`${field?.id}-${index}`}
              form={form}
              field={field}
              fieldErrors={fieldErrors}
              hiddenInputs={hiddenInputs}
            />
          ))}
          <Button
            ref={submitRef}
            type="submit"
            size="large"
            className={styles.submitButton}
            disabled={isLoading}
            rightIcon={isLoading ? null : 'send'}
            style={submitButton === false ? { display: 'none' } : {}}
          >
            {form?.button?.text || 'Submit'} {isLoading && <Loading />}
          </Button>
        </>
      )}
    </Form>
  );
}
