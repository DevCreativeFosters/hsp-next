'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import ReCAPTCHA from 'react-google-recaptcha';

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
  const recaptchaRef = useRef(null);
  const formRef = useRef();

  useEffect(() => {
    if (!googleRecaptchaSitekey) {
      console.error('ReCAPTCHA site key is missing');
    }
  }, [googleRecaptchaSitekey]);

  const handleSubmit = useCallback(
    async token => {
      setIsBusy(true);
      try {
        const response = await sendBrevoNewsletterData({
          EMAIL: email,
          'g-recaptcha-response': token,
          locale: 'en',
        });

        if (response.success) {
          setError(null);
          setConfirmationMessage(response.message);
          setEmail('');
        } else if (response.errors) {
          setConfirmationMessage(null);
          setError(Object.values(response.errors).join(' '));
        }
      } catch (err) {
        console.error('Error submitting newsletter data:', err);
        setError('Failed to submit form. Please try again.');
      }
      setIsBusy(false);
    },
    [email],
  );

  const onCaptchaSuccess = useCallback(
    token => {
      console.log('Captcha success, token:', token);
      if (formRef.current?.checkValidity()) {
        handleSubmit(token);
      }
    },
    [handleSubmit],
  );

  const onRecaptchaErrored = useCallback(() => {
    console.error('ReCAPTCHA errored');
    setIsBusy(false);
  }, []);

  const onRecaptchaExpired = useCallback(() => {
    console.error('ReCAPTCHA expired');
    setIsBusy(false);
  }, []);

  const onRecaptchaError = useCallback(() => {
    console.error('ReCAPTCHA error callback');
    setIsBusy(false);
  }, []);

  return (
    <Container>
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
        <form
          className={styles.form}
          onSubmit={e => e.preventDefault()}
          ref={formRef}
        >
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
                className={clsx(styles.button, { [styles.isBusy]: isBusy })}
                disabled={isBusy}
                isBusy={isBusy}
                onClick={event => {
                  const isValid = formRef.current.reportValidity();
                  if (isValid) {
                    setIsBusy(true);
                    if (recaptchaRef.current) {
                      recaptchaRef.current.execute();
                    } else {
                      console.error('ReCAPTCHA ref is not available');
                      setIsBusy(false);
                    }
                  } else {
                    event.preventDefault();
                  }
                }}
                size="large"
                type="button"
              >
                Submit
              </Button>
            </div>
          )}
          <ReCAPTCHA
            onChange={onCaptchaSuccess}
            onError={onRecaptchaError}
            onErrored={onRecaptchaErrored}
            onExpired={onRecaptchaExpired}
            ref={recaptchaRef}
            sitekey={googleRecaptchaSitekey}
            size="invisible"
          />
        </form>
      </div>
    </Container>
  );
}
