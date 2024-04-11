'use client';

import { forwardRef, useCallback, useEffect, useState } from 'react';

import { GravityFormProvider } from '@contexts/gravity-form';
import { useGravityFormsStaticData } from '@contexts/gravity-forms-static-data';
import { useUserContext } from '@contexts/user';

import { getGravityForm } from '@lib/api/get-gravity-form';

import Loading from '@components/loading/loading';

import GForm from './gform';

const storeNotListed = {
  text: 'My store is not listed',
  value: 'store-not-listed',
};

function GravityFormWrapperWithRef(
  {
    attributes,
    hiddenInputs = [],
    isDirty = false,
    onChange = () => null,
    onError = () => null,
    onLoad = () => null,
    onReset = () => null,
    onSubmit = () => null,
    onSuccess = () => null,
    preventConfirmation,
    submitButton = true,
  },
  ref,
) {
  const [gfForm, setGfForm] = useState(null);

  const { user } = useUserContext();
  const gravityFormsStaticData = useGravityFormsStaticData();

  const replaceFieldValue = useCallback(({ field, key, value }) => {
    if (!value) return;
    if (field.inputs) {
      const childField = field.inputs.find(({ name }) => name === key);
      if (childField) {
        childField.value = value;
      }
    } else if (field.hasOwnProperty('value') && !field.value) {
      field.value = value;
    }
  }, []);

  const replaceFieldValueWithSystemData = useCallback(
    ({ field, key }) => {
      const data = gravityFormsStaticData[key];
      if (!data) return false;

      switch (key) {
        case 'productSubCategories':
          field.choices = data.map(({ name, slug }) => ({
            text: name,
            value: slug,
          }));
          break;
        case 'stores':
          field.choices = data.map(({ id, title }) => ({
            text: title,
            value: id,
          }));
          field.choices.unshift(storeNotListed);
          break;
      }
    },
    [gravityFormsStaticData],
  );

  const injectDynamicallyPopulatedValues = useCallback(
    (form, attributes = {}) => {
      // Side effect: this method modifies the `form` object

      const formFields = form?.formFields?.nodes;

      Object.entries(attributes)
        .filter(([key]) => key !== 'id')
        .forEach(([attrKey, attrValue]) => {
          const field = formFields.find(
            ({ canPrepopulate, inputName, inputs, value }) => {
              if (inputs) {
                return inputs.find(
                  ({ name }) =>
                    name && name === attrKey && canPrepopulate && !value,
                );
              } else {
                return (
                  inputName && inputName === attrKey && canPrepopulate && !value
                );
              }
            },
          );

          if (field && attrValue) {
            const userRegexMatch = attrValue.match(/^(user:)([\w-]*)/);
            if (userRegexMatch) {
              const userFieldKey = userRegexMatch?.[2];
              const newValue =
                user && userFieldKey && user[userFieldKey]
                  ? user[userFieldKey]
                  : null;
              replaceFieldValue({ field, key: attrKey, value: newValue });
            }
            const systemRegexMatch = attrValue.match(/^(system:)([\w-]*)/);
            if (systemRegexMatch) {
              const dataIdentifier = systemRegexMatch?.[2];
              replaceFieldValueWithSystemData({
                field,
                key: dataIdentifier,
              });
            }
          }
        });
    },
    [replaceFieldValue, replaceFieldValueWithSystemData, user],
  );

  const fetchGfForm = useCallback(async () => {
    if (attributes.id) {
      const form = await getGravityForm(attributes.id);
      injectDynamicallyPopulatedValues(form.gfForm, attributes);
      setGfForm(form.gfForm);
    }
  }, [attributes, injectDynamicallyPopulatedValues]);

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
        attributes={attributes}
        form={gfForm}
        hiddenInputs={hiddenInputs}
        innerRef={ref}
        isDirty={isDirty}
        onChange={onChange}
        onError={onError}
        onReset={onReset}
        onSubmit={onSubmit}
        onSuccess={onSuccess}
        preventConfirmation={preventConfirmation}
        submitButton={submitButton}
      />
    </GravityFormProvider>
  );
}

export default forwardRef(GravityFormWrapperWithRef);
