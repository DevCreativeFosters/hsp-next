'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import styles from './card-payment.module.scss';

// Point this at your WordPress REST base. Same-origin / reverse-proxied
// setups can leave this as '/wp-json'; a separate WP domain needs the
// full origin — e.g. set NEXT_PUBLIC_WORDPRESS_URL to
// "https://wordpress-1505184-5847603.cloudwaysapps.com".
const WP_REST_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL
  ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL.replace(/\/+$/, '')}/wp-json`
  : '/wp-json';

// Same script URL already confirmed working against the sandbox account
// from the wp-admin test panel — Cybersource serves this one script for
// both sandbox and production; the capture context itself (fetched below)
// is what determines which environment a session talks to.
const FLEX_MICROFORM_SRC =
  'https://flex.cybersource.com/cybersource/assets/microform/0.11/flex-microform.min.js';

let flexScriptPromise = null;
function loadFlexScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('No window'));
  }
  if (window.Flex) return Promise.resolve();
  if (flexScriptPromise) return flexScriptPromise;

  flexScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${FLEX_MICROFORM_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () =>
        reject(new Error('Failed to load the payment library')),
      );
      return;
    }
    const script = document.createElement('script');
    script.src = FLEX_MICROFORM_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load the payment library'));
    document.body.appendChild(script);
  });

  return flexScriptPromise;
}

/**
 * Cybersource Flex Microform card-capture card.
 *
 * Card Number and Security Code are real Cybersource-hosted iframe fields
 * — tokenised client-side, so the raw card number/CVV never touch this
 * app or WordPress. Expiry Month/Year are plain inputs: per Cybersource's
 * own Flex Microform spec they are NOT valid hosted-field types (only
 * "number" and "securityCode" are), so they're collected here and passed
 * into createToken() as options instead.
 *
 * Exposes `tokenize()` via ref so the parent checkout form can request a
 * transient token synchronously as part of its own submit flow — call
 * this BEFORE creating the order via checkoutOrder, so a tokenization
 * failure (bad card, expired session) never leaves an orphaned order
 * behind. See the integration notes below for the exact call sequence.
 */
const CardPayment = forwardRef(function CardPayment(_props, ref) {
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');

  const microformRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadFlexScript();
        if (cancelled) return;

        const res = await fetch(
          `${WP_REST_URL}/nab-payment/v1/checkout/capture-context`,
        );
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data?.captureContext) {
          throw new Error(
            data?.message || 'Unable to start the secure payment session.',
          );
        }

        const flex = new window.Flex(data.captureContext);
        const microform = flex.microform({
          styles: {
            ':disabled': { color: '#999' },
            ':focus': { color: '#1a1a1a' },
            input: {
              color: '#1a1a1a',
              'font-size': '15px',
            },
            invalid: { color: '#d63638' },
            valid: { color: '#1a1a1a' },
          },
        });

        microform
          .createField('number', { placeholder: 'Card number' })
          .load('#nab-card-number-field');
        microform
          .createField('securityCode', { placeholder: 'CVV' })
          .load('#nab-card-cvv-field');

        microformRef.current = microform;
        if (!cancelled) setStatus('ready');
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(err?.message || 'Unable to load the payment form.');
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    isReady: () => status === 'ready',

    /**
     * Resolves with { transientToken } or rejects with an Error whose
     * .message is safe to show the shopper directly.
     */
    tokenize: () =>
      new Promise((resolve, reject) => {
        if (!microformRef.current) {
          reject(new Error('Payment form is not ready yet.'));
          return;
        }
        if (!expirationMonth || !expirationYear) {
          reject(new Error('Please enter the card expiry month and year.'));
          return;
        }
        microformRef.current.createToken(
          { expirationMonth, expirationYear },
          (err, data) => {
            if (err) {
              reject(new Error(err?.message || 'Unable to process this card.'));
              return;
            }
            const transientToken =
              data && (data.transientToken || data.transient_token || data);
            if (!transientToken || typeof transientToken !== 'string') {
              reject(new Error('No payment token was returned.'));
              return;
            }
            resolve({ transientToken });
          },
        );
      }),
  }));

  return (
    <div className={styles.cardPaymentForm}>
      {status === 'error' && (
        <p className={styles.cardPaymentError}>❌ {errorMessage}</p>
      )}

      <div className={styles.formRow}>
        <div className={styles.formColFull}>
          <label className={styles.fieldLabel}>Card Number</label>
          <div className={styles.hostedField} id="nab-card-number-field" />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formCol}>
          <label className={styles.fieldLabel}>Expiry Month</label>
          <input
            autoComplete="cc-exp-month"
            inputMode="numeric"
            maxLength={2}
            onChange={e =>
              setExpirationMonth(e.target.value.replace(/\D/g, ''))
            }
            placeholder="MM"
            value={expirationMonth}
          />
        </div>
        <div className={styles.formCol}>
          <label className={styles.fieldLabel}>Expiry Year</label>
          <input
            autoComplete="cc-exp-year"
            inputMode="numeric"
            maxLength={4}
            onChange={e => setExpirationYear(e.target.value.replace(/\D/g, ''))}
            placeholder="YYYY"
            value={expirationYear}
          />
        </div>
        <div className={styles.formCol}>
          <label className={styles.fieldLabel}>Security Code</label>
          <div className={styles.hostedField} id="nab-card-cvv-field" />
        </div>
      </div>

      {status === 'loading' && (
        <p className={styles.cardPaymentHint}>Loading secure payment form…</p>
      )}
    </div>
  );
});

export default CardPayment;
