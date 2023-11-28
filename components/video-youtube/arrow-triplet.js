import styles from '@components/video-youtube/arrow-triplet.module.scss';
import clsx from 'clsx';

export function ArrowTriplet({ reversed }) {
  return (
    <div
      className={clsx(styles.seekArrowsContainer, {
        [styles.isReversed]: reversed,
      })}
    >
      {[...Array(3)].map((_, index) => (
        <span
          key={index}
          className={clsx(styles.seekArrow, { [styles.isReversed]: reversed })}
        />
      ))}
    </div>
  );
}
