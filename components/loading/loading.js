import clsx from 'clsx';
import ProgressActivityIcon from '@assets/icons/progress-activity.svg';
import styles from './loading.module.scss';

export default function Loading({ color, size }) {
  return (
    <span
      className={clsx(styles.loading, { [styles.large]: size === 'large' })}
    >
      <ProgressActivityIcon style={color === 'white' ? { fill: '#fff' } : {}} />
    </span>
  );
}
