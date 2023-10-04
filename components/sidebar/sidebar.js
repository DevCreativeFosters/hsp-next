'use client';

import styles from './sidebar.module.scss';

export default function Sidebar({ children }) {
  return <div className={styles.sidebar}>{children}</div>;
}
