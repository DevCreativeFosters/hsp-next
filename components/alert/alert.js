import { getIcon } from '@lib/icons';
import clsx from 'clsx';
import styles from './alert.module.scss';

export default function Alert({ icon = 'info', className = '', content }) {
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
