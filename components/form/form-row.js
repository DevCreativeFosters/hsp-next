'use client';

import styles from './form-row.module.scss';

export default function FormRow({ children }) {
  return <div className={styles.formRow}>{children}</div>;
}
