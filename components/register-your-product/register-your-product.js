'use client';

import React from 'react';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import { useUserContext } from '@contexts/user';

import Button from '@components/button/button';

import Arrow from '@assets/images/arrow.svg';

import styles from './register-your-product.module.scss';

function RegisterYourProduct() {
  const pathname = usePathname();
  const { loading, user } = useUserContext();

  if (pathname === '/support/register-your-product' && !user?.id && !loading) {
    return (
      <div className={styles.registerFooter}>
        <div className={styles.halfcontentPart}>
          <h5>Already have an account?</h5>
          <Button
            className={clsx(styles.widthAuto)}
            href="/login"
            size="large"
            variant="primary"
          >
            Log In to complete registration <Arrow className="arrow" />
          </Button>
          <p>
            Log in to quickly auto-fill your details and keep all your product
            registrations in one place.
          </p>
        </div>
        <div className={styles.halfcontentPart}>
          <h5>New to HSP?</h5>
          <Button
            className={clsx(styles.outLineBtn, styles.widthAuto)}
            href="/register"
            size="large"
            variant="secondary"
          >
            Create an account <Arrow className="arrow" />
          </Button>
          <p>
            Log in to quickly auto-fill your details and keep all your product
            registrations in one place.
          </p>
        </div>
        <div className={styles.fullcontentPart}>
          <h5>Prefer not to sign up right now?</h5>
          <Button variant="tertiary">Continue without an account.</Button>
        </div>
      </div>
    );
  }

  return null;
}

export default RegisterYourProduct;
