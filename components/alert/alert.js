import clsx from 'clsx';

import { getIcon } from '@lib/icons';

import styles from './alert.module.scss';

export default function Alert({ className = '', content, icon = 'info' }) {
  const Icon = getIcon(icon);

  return (
    <div className={clsx(styles.alert, className)}>
      <div className={styles.icon}>
        <Icon />
      </div>
      {content}
    </div>
  );
}
