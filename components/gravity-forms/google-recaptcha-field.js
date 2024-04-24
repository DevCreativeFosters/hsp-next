import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ReCAPTCHA from 'react-google-recaptcha';

import useGravityForm from '@hooks/useGravityForm';

import styles from './google-recaptcha-field.module.scss';

const CAPTCHA_FE_ERROR_MESSAGE = 'Please take this test';

export default function GoogleRecaptchaField({ field, fieldErrors, form }) {
  const [captchaValue, setCaptchaValue] = useState(null);

  const recaptchaRef = useRef(null);
  const fakeInputRef = useRef(null);

  const { databaseId: id } = field;
  const { dispatch } = useGravityForm();

  const fieldError = useMemo(() => {
    return fieldErrors.find(fieldError => fieldError.id === id);
  }, [fieldErrors, id]);

  const handleChange = useCallback(
    value => {
      setCaptchaValue(value);
      dispatch({
        payload: {
          id,
          value,
        },
        type: 'updateFieldValue',
      });
    },
    [dispatch, id],
  );

  const handleInvalid = useCallback(() => {
    const fakeInputEl = fakeInputRef.current;
    fakeInputEl.setCustomValidity(CAPTCHA_FE_ERROR_MESSAGE);
  }, []);

  useEffect(
    function syncValidity() {
      const fakeInputEl = fakeInputRef.current;
      fakeInputEl.setCustomValidity(
        captchaValue ? '' : CAPTCHA_FE_ERROR_MESSAGE,
      );
    },
    [captchaValue],
  );

  return (
    <div className={styles.recaptcha}>
      <ReCAPTCHA
        onChange={handleChange}
        onExpired={() => setCaptchaValue(null)}
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITEKEY}
        size="normal"
      />
      <div className={styles.fakeInputContainer}>
        <input
          className={styles.fakeInput}
          onInvalid={handleInvalid}
          ref={fakeInputRef}
          required={!captchaValue}
          type="text"
        />
      </div>
      {fieldError && (
        <div className={styles.errorMessage}>{fieldError.message}</div>
      )}
    </div>
  );
}
