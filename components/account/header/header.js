'use client';

import { useUserContext } from '@contexts/user';

import styles from './header.module.scss';

function AccountHeader() {
  const { handleLogout } = useUserContext();

  return (
    <section className={styles.accountHeader}>
      <div className={styles.headerWrapper}>
        <h1>Account</h1>
        <div className={styles.btns}>
          <button
            className={styles.button}
            onClick={() => handleLogout()}
            type="button"
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </section>
  );
}

export default AccountHeader;
