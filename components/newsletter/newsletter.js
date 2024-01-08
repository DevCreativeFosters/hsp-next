'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import { brevoNewsletterSignup } from '@lib/api';
import Button from '@components/button/button';
import Container from '@components/container/container';
import Input from '@components/form/input';
import IllustrationImage from '@assets/images/newsletter-illustration.png';
import styles from './newsletter.module.scss';

const title = 'Join our community';
const description = `
  <p>
    Want to beef up your ride? The Ford Ranger PX Hard Lid is the
    perfect meal ticket. This tonneau cover boasts dimensional,
    aerodynamic styling and comes with premium standard features.
  </p>
`;

export default function Newsletter({ googleRecaptchaSitekey }) {
  const [email, setEmail] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const tokenRef = useRef(null);
  const formRef = useRef();

  const onCaptchaSuccess = useCallback(token => {
    tokenRef.current = token;
    if (formRef.current?.checkValidity()) {
      formRef.current.requestSubmit();
    }
  }, []);

  const onFormSubmit = useCallback(
    async ev => {
      const token = tokenRef.current;
      ev.preventDefault();
      setIsBusy(true);
      const response = await brevoNewsletterSignup({
        EMAIL: email,
        locale: 'en',
        'g-recaptcha-response': token,
        // email_address_check: '',
      });

      if (response.success) {
        setError(null);
        setConfirmationMessage(response.message);
        setEmail('');
      } else if (response.errors) {
        setConfirmationMessage(null);
        setError(Object.values(response.errors).join(' '));
      }
      setIsBusy(false);
    },
    [email],
  );

  useEffect(() => {
    window.onCaptchaSuccess = onCaptchaSuccess;
  }, [onCaptchaSuccess]);

  return (
    <Container>
      <Script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${googleRecaptchaSitekey}`}
      />

      <div className={styles.wrapper}>
        {IllustrationImage && (
          <div className={styles.illustrationWrapper}>
            <Image
              className={styles.illustration}
              src={IllustrationImage.src}
              width={IllustrationImage.width}
              height={IllustrationImage.height}
              style={{
                aspectRatio:
                  parseInt(IllustrationImage.width) /
                  parseInt(IllustrationImage.height),
              }}
              alt="Ford Ranger"
            />
          </div>
        )}
        <h3 className={styles.title}>{title}</h3>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <form className={styles.form} ref={formRef} onSubmit={onFormSubmit}>
          <div className={styles.emailWrapper}>
            {confirmationMessage ? (
              <div className={styles.confirmation}>{confirmationMessage}</div>
            ) : (
              <Input
                type="email"
                size="large"
                placeholder="Enter your e-mail address"
                background="dark"
                value={email}
                errorMessage={error}
                required
                onChange={ev => setEmail(ev.target.value)}
              />
            )}
          </div>
          {confirmationMessage ? (
            <Button
              className={styles.button}
              type="button"
              size="large"
              onClick={ev => {
                ev.preventDefault();
                setConfirmationMessage(null);
              }}
            >
              Reset
            </Button>
          ) : (
            <Button
              className={clsx(styles.button, 'g-recaptcha', {
                [styles.isBusy]: isBusy,
              })}
              type="submit"
              size="large"
              data-sitekey={googleRecaptchaSitekey}
              data-callback="onCaptchaSuccess"
              data-action="requestSubmit"
              onClick={ev => {
                const isValid = formRef.current.reportValidity();
                if (isValid) {
                  setIsBusy(true);
                } else {
                  ev.preventDefault();
                }
              }}
              disabled={isBusy}
              isBusy={isBusy}
            >
              Submit
            </Button>
          )}
        </form>
      </div>
    </Container>
  );
}
