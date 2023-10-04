'use client';

import styles from './content-box.module.scss';

export default function ContentBox({ children }) {
  return <div className={styles.contentBox}>{children}</div>;
}
