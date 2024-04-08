'use client';

import { useCallback, useRef, useState } from 'react';

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
  googleRecaptchaSitekey,
  title,
  description,
}) {
  const [email, setEmail] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const recaptchaRef = useRef(null);
  const formRef = useRef();

  const handleSubmit = useCallback(
    async token => {
      setIsBusy(true);
      try {
        const response = await sendBrevoNewsletterData({
          EMAIL: email,
          locale: 'en',
          'g-recaptcha-response': token,
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
      if (formRef.current?.checkValidity()) {
        handleSubmit(token);
      }
    },
    [handleSubmit],
  );

  return (
    <Container>
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
          ref={formRef}
          onSubmit={e => e.preventDefault()}
          className={styles.form}
        >
          <div className={styles.emailWrapper}>
            {confirmationMessage ? (
              <div className={styles.confirmation}>{confirmationMessage}</div>
            ) : (
              <Input
                className={styles.input}
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
            <div>
              <Button
                type="button"
                size="large"
                className={clsx(styles.button, { [styles.isBusy]: isBusy })}
                disabled={isBusy}
                isBusy={isBusy}
                onClick={event => {
                  const isValid = formRef.current.reportValidity();
                  if (isValid) {
                    setIsBusy(true);
                    recaptchaRef.current.execute();
                  } else {
                    event.preventDefault();
                  }
                }}
              >
                Submit
              </Button>
            </div>
          )}
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={googleRecaptchaSitekey}
            onChange={onCaptchaSuccess}
          />
        </form>
      </div>
    </Container>
  );
}
