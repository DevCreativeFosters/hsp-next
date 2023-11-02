'use client';

import clsx from 'clsx';
import styles from './content-box.module.scss';

export default function ContentBox({ className, children }) {
  return <div className={clsx(styles.contentBox, className)}>{children}</div>;
}
