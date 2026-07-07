'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import styles from './create-account-cta.module.scss';

// Guest-only CTA that sits directly below the Download Invoice
// button on /order-status/[orderId]. Same size as the red
// download button but black — encourages the guest checkout user
// to create an account so future orders are easier to track.
// Logged-in users never see this.
export default function CreateAccountCta() {
  const [isGuest, setIsGuest] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // The order-status page renders server-side; auth lives in
    // localStorage on the client, so the initial render is null
    // (button hidden), and this effect flips it on hydrate.
    const userId = localStorage.getItem('userId');
    setIsGuest(!userId);
  }, []);

  if (!isGuest) return null;

  return (
    <Link className={styles.createAccountBtn} href="/register">
      CREATE AN ACCOUNT
    </Link>
  );
}
