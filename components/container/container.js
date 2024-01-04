import clsx from 'clsx';
import styles from './container.module.scss';

export default function Container({
  relative,
  collapseMargin,
  collapseTopMargin,
  collapseBottomMargin,
  className,
  children,
}) {
  return (
    <div
      className={clsx(
        styles.container,
        {
          [styles.isRelative]: relative,
          [styles.collapseTopMargin]: collapseTopMargin,
          [styles.collapseBottomMargin]: collapseBottomMargin,
          [styles.collapseMargin]: collapseMargin,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
