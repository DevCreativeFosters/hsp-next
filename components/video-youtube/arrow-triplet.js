import clsx from 'clsx';

import styles from '@components/video-youtube/arrow-triplet.module.scss';

export function ArrowTriplet({ reversed }) {
  return (
    <div
      className={clsx(styles.seekArrowsContainer, {
        [styles.isReversed]: reversed,
      })}
    >
      {[...Array(3)].map((_, index) => (
        <span
          className={clsx(styles.seekArrow, { [styles.isReversed]: reversed })}
          key={index}
        />
      ))}
    </div>
  );
}
