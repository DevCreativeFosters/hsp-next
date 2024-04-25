import clsx from 'clsx';

import VideoEl from '@components/video-reel/video-el';

import styles from './video-reel.module.scss';

export default function VideoReel({ currentIndex, items, setCurrentIndex }) {
  return (
    <div className={styles.track} data-current={currentIndex} id="video-reel">
      <span className={styles.placeholderFrontTile} />
      <span className={styles.placeholderFrontTile} />
      <span className={styles.placeholderFrontTile} />
      {items.map(({ celebrityPostsCustomFields, title }, index) => (
        <div
          className={styles.tileContainer}
          key={index}
          onClick={() => setCurrentIndex(index)}
        >
          <div
            className={clsx(styles.tile, {
              [styles.isActive]: index === currentIndex,
            })}
          >
            <VideoEl
              index={index}
              isActive={index === currentIndex}
              thumbnail={celebrityPostsCustomFields?.thumbnail?.node}
              title={title}
              video={celebrityPostsCustomFields?.video?.node}
            />
            <h5 className={styles.title}>{title}</h5>
          </div>
        </div>
      ))}

      <span className={styles.placeholderEndTile} />
      <span className={styles.placeholderEndTile} />
      <span className={styles.placeholderEndTile} />
    </div>
  );
}
