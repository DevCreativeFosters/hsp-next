import ProgressActivityIcon from '@assets/material-icons/progress-activity.svg';
import styles from './loading.module.scss';

export default function Loading() {
  return (
    <span className={styles.loading}>
      <ProgressActivityIcon />
    </span>
  );
}
