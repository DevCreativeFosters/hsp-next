import clsx from 'clsx';
import styles from './tag.module.scss';

export default function Tag({ name, variant = 'secondary' }) {
  const tagClassNames = clsx(styles.tag, {
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
  });
  return <>{name ? <div className={tagClassNames}>{name}</div> : null}</>;
}
