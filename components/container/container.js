import clsx from 'clsx';
import styles from './container.module.scss';

export default function Container({ relative, children }) {
  return (
    <div className={clsx(styles.container, { [styles.isRelative]: relative })}>
      {children}
    </div>
  );
}
