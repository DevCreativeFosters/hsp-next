import clsx from 'clsx';

import styles from './container.module.scss';

export default function Container({
  children,
  className,
  collapseBottomMargin,
  collapseMargin,
  collapseTopMargin,
  collapseTopPadding,
  flexibleBlockPadding,
  noPadding,
  relative,
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
          [styles.noPadding]: noPadding,
          [styles.flexibleBlockPadding]: flexibleBlockPadding,
          [styles.collapseTopPadding]: collapseTopPadding,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
