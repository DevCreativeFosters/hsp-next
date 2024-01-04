'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import { brevoNewsletterSignup } from '@lib/api';
import Button from '@components/button/button';
import Container from '@components/container/container';
import Input from '@components/form/input';
import IllustrationImage from '@assets/images/newsletter-illustration.png';
import styles from './newsletter.module.scss';

const GOOGLE_RECAPTCHA_SITEKEY = '6LefRkUpAAAAAJH90AsZ4wLZ6fou7USSFkf4Z-QZ';
const BREVO_SIGNUP_URL =
  'https://e63d896b.sibforms.com/serve/MUIFAFFmSfbbHDUbEAHTGrPBlm2kYnxEZKCHYNgZ82_TV32OpvoRnJLVvA_KUbXpVmUX2sztaA4xHG39IcSCjL4n8mm95Tk-Qm66-8Lx7Bx5V8IBdDYfwviOLHSH6MekbQyjQ4ZybzSy8ADU2Y1zcEYJNbRtjTgIuSjM339sO_3oKBD9tXPOMveDRf2ByWz_qkXHbZ32QIDfPAuM';

const title = 'Join our community';
const description = `
  <p>
    Want to beef up your ride? The Ford Ranger PX Hard Lid is the
    perfect meal ticket. This tonneau cover boasts dimensional,
    aerodynamic styling and comes with premium standard features.
  </p>
`;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [error, setError] = useState(false);
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
      const response = await brevoNewsletterSignup(
        BREVO_SIGNUP_URL + '?isAjax=1',
        {
          EMAIL: email,
          locale: 'en',
          'g-recaptcha-response': token,
          // email_address_check: '',
        },
      );

      if (response.success) {
        setError(null);
        setConfirmationMessage(response.message);
        setEmail('');
      } else if (response.errors) {
        setConfirmationMessage(null);
        setError(Object.values(response.errors).join(' '));
      }
    },
    [email],
  );

  useEffect(() => {
    window.onCaptchaSuccess = onCaptchaSuccess;
  }, [onCaptchaSuccess]);

  return (
    <Container>
      <Script src="https://www.google.com/recaptcha/api.js?hl=en" />

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
              className={[styles.button, 'g-recaptcha']}
              type="submit"
              size="large"
              data-sitekey={GOOGLE_RECAPTCHA_SITEKEY}
              data-callback="onCaptchaSuccess"
              data-action="requestSubmit"
              onClick={ev => {
                console.log('onClick');
                const isValid = formRef.current.reportValidity();
                if (!isValid) {
                  ev.preventDefault();
                }
              }}
            >
              Submit
            </Button>
          )}
        </form>
      </div>
    </Container>
  );
}
