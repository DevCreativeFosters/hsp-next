'use client';

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ApolloClient, InMemoryCache, gql, useMutation } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

import useGravityForm from '@hooks/useGravityForm';

import { updateGtagUserData } from '@lib/gtag-user-data';

import Button from '@components/button/button';
import DisclaimerTC from '@components/disclaimer-tc/disclaimer-tc';
import Form from '@components/form/form';
import Loading from '@components/loading/loading';

import Confirmation from './confirmation';
import GravityFormsField from './field';
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
  attributes = {},
  form,
  hiddenInputs,
  innerRef,
  isDirty,
  onChange,
  onError,
  onReset,
  onSubmit,
  onSuccess,
  preventConfirmation,
  submitButton,
}) {
  const [isLoading, setLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState([]);

  const formFields = form.formFields?.nodes || [];
  const { dispatch, state } = useGravityForm();
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

  const [formSubmitMutation] = useMutation(SUBMIT_MUTATION, {
    client,
  });

  const handleSubmit = async ev => {
    if (ev) ev.preventDefault();

    if (isLoading) {
      return;
    }

    setLoading(true);
    onSubmit();

    await formSubmitMutation({
      variables: {
        input: {
          fieldValues: state,
          id: form.formId,
        },
      },
    })
      .then(response => {
        const gfFormConfirmation = response.data.submitGfForm.confirmation;
        const errors = response.data.submitGfForm.errors;
        if (!errors?.length) {
          // Combine field definitions with state values
          const enrichedState = state.map(fieldState => {
            const fieldDef = formFields.find(
              f => f.databaseId === fieldState.id,
            );
            return {
              ...fieldState,
              label: fieldDef?.label,
              type: fieldDef?.type,
            };
          });

          console.group('Form Submission Data');
          console.log('Enriched State:', enrichedState);
          console.groupEnd();

          updateGtagUserData(enrichedState);
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

  const [isConfirmationDirty, setIsConfirmationDirty] = useState(false);

  const scrollRef = useRef();

  useEffect(
    function scrollOnModeChange() {
      if (!preventConfirmation) {
        if (isSubmitted) {
          setIsConfirmationDirty(true);
          scrollRef.current?.scrollIntoView(true);
        } else if (isConfirmationDirty) {
          scrollRef.current?.scrollIntoView(true);
        }
      }
    },
    [isConfirmationDirty, isSubmitted, preventConfirmation],
  );

  return (
    <Form
      isDirty={isDirty}
      method="post"
      onChange={onChange}
      onSubmit={handleSubmit}
      scrollRef={scrollRef}
      withBackground={attributes.withBackground}
      withCustomStyle01={attributes.withCustomStyle01}
      withPadding={attributes.withPadding}
    >
      {isSubmitted && !preventConfirmation ? (
        <Confirmation content={confirmation.message} resetForm={resetForm} />
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
              field={field}
              fieldErrors={fieldErrors}
              form={form}
              hiddenInputs={hiddenInputs}
              key={`id-${field?.databaseId}-${index}`}
            />
          ))}

          {attributes.withTermsAndConditions && (
            <DisclaimerTC fullWidth withBlockMargin />
          )}

          <div className={styles.submitWrapper}>
            <Button
              className={styles.submitButton}
              disabled={isLoading}
              ref={submitRef}
              rightIcon={isLoading ? null : 'send'}
              size="large"
              style={submitButton === false ? { display: 'none' } : {}}
              type="submit"
            >
              {form?.button?.text || 'Submit'} {isLoading && <Loading />}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
}
