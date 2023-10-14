'use client';

import clsx from 'clsx';
import styles from './page-grid.module.scss';

export default function PageGrid({ children, variant }) {
  const pageGridClassnames = clsx(styles.pageGrid, {
    [styles.postGrid]: variant === 'post',
  });
  return <div className={pageGridClassnames}>{children}</div>;
}
