'use client';

import styles from './page-grid.module.scss';

export default function PageGrid({ children }) {
  return <div className={styles.pageGrid}>{children}</div>;
}
