import clsx from 'clsx';
import ProgressActivityIcon from '@assets/icons/progress-activity.svg';
import styles from './loading.module.scss';

export default function Loading({ color = 'black', size = 'small' }) {
  return (
    <span className={clsx(styles.loading, { [styles.big]: size === 'big' })}>
      <ProgressActivityIcon style={color === 'white' ? { fill: '#fff' } : {}} />
    </span>
  );
}
