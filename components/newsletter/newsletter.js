'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Script from 'next/script';

import { sendBrevoNewsletterData } from '@lib/api/send-brevo-newsletter-data';

import Button from '@components/button/button';
import Container from '@components/container/container';
import Input from '@components/form/input';

import IllustrationImage from '@assets/images/newsletter-illustration.webp';

import styles from './newsletter.module.scss';

export default function Newsletter({
  description,
  googleRecaptchaSitekey,
  title,
}) {
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
      const response = await sendBrevoNewsletterData({
        EMAIL: email,
        'g-recaptcha-response': token,
        locale: 'en',
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
              alt="Ford Ranger"
              className={styles.illustration}
              height={IllustrationImage.height}
              src={IllustrationImage.src}
              style={{
                aspectRatio:
                  parseInt(IllustrationImage.width) /
                  parseInt(IllustrationImage.height),
              }}
              width={IllustrationImage.width}
            />
          </div>
        )}
        {title && <h3 className={styles.title}>{title}</h3>}
        {description && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        )}
        <form className={styles.form} onSubmit={onFormSubmit} ref={formRef}>
          <div className={styles.emailWrapper}>
            {confirmationMessage ? (
              <div className={styles.confirmation}>{confirmationMessage}</div>
            ) : (
              <Input
                background="dark"
                className={styles.input}
                errorMessage={error}
                onChange={ev => setEmail(ev.target.value)}
                placeholder="Enter your e-mail address"
                required
                size="large"
                type="email"
                value={email}
              />
            )}
          </div>
          {confirmationMessage ? (
            <Button
              className={styles.button}
              onClick={ev => {
                ev.preventDefault();
                setConfirmationMessage(null);
              }}
              size="large"
              type="button"
            >
              Reset
            </Button>
          ) : (
            <div>
              <Button
                className={clsx(styles.button, 'g-recaptcha', {
                  [styles.isBusy]: isBusy,
                })}
                data-action="requestSubmit"
                data-callback="onCaptchaSuccess"
                data-sitekey={googleRecaptchaSitekey}
                disabled={isBusy}
                isBusy={isBusy}
                onClick={ev => {
                  const isValid = formRef.current.reportValidity();
                  if (isValid) {
                    setIsBusy(true);
                  } else {
                    ev.preventDefault();
                  }
                }}
                size="large"
                type="submit"
              >
                Submit
              </Button>
            </div>
          )}
        </form>
      </div>
    </Container>
  );
}
