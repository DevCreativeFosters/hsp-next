import clsx from 'clsx';

import styles from './tag.module.scss';

export default function Tag({ name, size, variant }) {
  if (!name) {
    return null;
  }

  return (
    <div
      className={clsx(styles.tag, {
        [styles.primary]: variant === 'primary',
        [styles.small]: size === 'small',
      })}
    >
      {name}
    </div>
  );
}
