import styles from '@components/video-youtube/arrow-triplet.module.scss';
import clsx from 'clsx';

export function ArrowTriplet({ reversed }) {
  return (
    <div
      className={clsx(styles.seekArrowsContainer, {
        [styles.isReversed]: reversed,
      })}
    >
      <span
        className={clsx(styles.seekArrow, { [styles.isReversed]: reversed })}
      />
      <span
        className={clsx(styles.seekArrow, { [styles.isReversed]: reversed })}
      />
      <span
        className={clsx(styles.seekArrow, { [styles.isReversed]: reversed })}
      />
    </div>
  );
}
