'use client';

import styles from './page-container.module.scss';

export default function PageContainer({ children }) {
  return <div className={styles.pageContainer}>{children}</div>;
}
