'use client';

import {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ApolloClient, gql, InMemoryCache, useMutation } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import Button from '@components/button/button';
import Form from '@components/form/form';
import Loading from '@components/loading/loading';
import DisclaimerTC from '@components/disclaimer-tc/disclaimer-tc';
import GravityFormsField from './field';
import Confirmation from './confirmation';
import useGravityForm from '@hooks/useGravityForm';
import styles from './gform.module.scss';

const SUBMIT_MUTATION = gql`
  mutation ($input: SubmitGfFormInput!) {
    submitGfForm(input: $input) {
      confirmation {
        type
        message
        url
      }
      errors {
        id
        message
      }
    }
  }
`;

export default function GForm({
  innerRef,
  form,
  isDirty,
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

  const client = useMemo(() => {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: createUploadLink({
        uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
      }),
    });
  }, []);

  const [formSubmitMutation] = useMutation(SUBMIT_MUTATION, { client });

  const handleSubmit = async ev => {
    if (ev) ev.preventDefault();
    if (isLoading) return;

    setLoading(true);
    onSubmit();

    await formSubmitMutation({
      variables: {
        input: {
          id: form.formId,
          fieldValues: state,
        },
      },
    })
      .then(response => {
        const gfFormConfirmation = response.data.submitGfForm.confirmation;
        const errors = response.data.submitGfForm.errors;
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
      isDirty={isDirty}
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
              key={`id-${field?.databaseId}-${index}`}
              form={form}
              field={field}
              fieldErrors={fieldErrors}
              hiddenInputs={hiddenInputs}
            />
          ))}

          {attributes.withTermsAndConditions && (
            <DisclaimerTC fullWidth withBlockMargin />
          )}

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
