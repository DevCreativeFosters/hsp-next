import clsx from 'clsx';
import styles from './container.module.scss';

export default function Container({
  relative,
  collapseMargin,
  className,
  children,
}) {
  return (
    <div
      className={clsx(
        styles.container,
        {
          [styles.isRelative]: relative,
          [styles.collapseMargin]: collapseMargin,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
