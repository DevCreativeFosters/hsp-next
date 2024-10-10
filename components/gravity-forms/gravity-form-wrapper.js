'use client';

import React, {
  Suspense,
  forwardRef,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useDebouncedCallback } from 'use-debounce';

import { GravityFormProvider } from '@contexts/gravity-form';
import { useGravityFormsStaticData } from '@contexts/gravity-forms-static-data';
import { useUserContext } from '@contexts/user';

import { getGravityForm } from '@lib/api/get-gravity-form';

import Loading from '@components/loading/loading';

const GForm = lazy(() => import('./gform'));

const storeNotListed = {
  text: 'My store is not listed',
  value: 'store-not-listed',
};

const formCache = {};

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

  const dynamicInputs = useMemo(() => ['productSubCategories', 'stores'], []);

  const injectDynamicallyPopulatedValues = useCallback(
    (form, attributes = {}) => {
      // Side effect: this method modifies the `form` object

      const formFields = form?.formFields?.nodes;

      if (!formFields) return;

      Object.entries(attributes).forEach(([attrKey, attrValue]) => {
        dynamicInputs.forEach(dynamicInput => {
          const field = formFields.find(({ canPrepopulate, inputName }) => {
            return inputName === dynamicInput && canPrepopulate;
          });
          if (field) {
            replaceFieldValueWithSystemData({ field, key: dynamicInput });
          }
        });

        const field = formFields.find(({ canPrepopulate, inputName }) => {
          return inputName === attrKey && canPrepopulate && !field.value;
        });

        if (field && attrValue) {
          const userRegexMatch = attrValue.match(/^(user:)([\w-]*)/);
          if (userRegexMatch && user?.[userRegexMatch[2]]) {
            replaceFieldValue({
              field,
              key: attrKey,
              value: user[userRegexMatch[2]],
            });
          }
        }
      });
    },
    [dynamicInputs, replaceFieldValue, replaceFieldValueWithSystemData, user],
  );

  const fetchGfForm = useCallback(async () => {
    if (attributes.id && !formCache[attributes.id]) {
      const form = await getGravityForm(attributes.id);
      formCache[attributes.id] = form.gfForm;
      injectDynamicallyPopulatedValues(form.gfForm, attributes);
      setGfForm(form.gfForm);
    } else {
      setGfForm(formCache[attributes.id]);
    }
  }, [attributes, injectDynamicallyPopulatedValues]);

  const debouncedFetchGfForm = useDebouncedCallback(fetchGfForm, 100);

  useEffect(() => {
    debouncedFetchGfForm();
  }, [debouncedFetchGfForm]);

  useEffect(() => {
    if (gfForm) {
      onLoad();
    }
  }, [gfForm, onLoad]);

  if (!gfForm) return <Loading color="white" size="large" />;

  return (
    <GravityFormProvider>
      <Suspense fallback={<Loading color="white" size="large" />}>
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
      </Suspense>
    </GravityFormProvider>
  );
}

export default React.memo(forwardRef(GravityFormWrapperWithRef));
