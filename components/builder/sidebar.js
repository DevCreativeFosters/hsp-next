'use client';

import clsx from 'clsx';
import styles from './sidebar.module.scss';

export default function Sidebar({ selectedProducts, className }) {
  return <div className={clsx(styles.sidebar, className)}>Sidebar</div>;
}
